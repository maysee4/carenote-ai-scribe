import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as File
    if (!audio) return NextResponse.json({ error: 'No audio file' }, { status: 400 })

    // Use OpenAI Whisper-compatible endpoint via fetch
    // Since we only have Anthropic, we use the Web Speech API on the client.
    // This server route is the fallback for iOS MediaRecorder.
    // We send the audio to Anthropic's audio-capable endpoint.

    const arrayBuffer = await audio.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    // Determine media type - Anthropic supports webm, mp4, ogg, wav, mpeg
    let mediaType = audio.type || 'audio/webm'
    // Normalise — Anthropic only accepts specific types
    if (mediaType.includes('ogg')) mediaType = 'audio/ogg'
    else if (mediaType.includes('mp4') || mediaType.includes('m4a')) mediaType = 'audio/mp4'
    else if (mediaType.includes('wav')) mediaType = 'audio/wav'
    else if (mediaType.includes('mpeg') || mediaType.includes('mp3')) mediaType = 'audio/mpeg'
    else mediaType = 'audio/webm'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'audio-1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Audio,
                },
              },
              {
                type: 'text',
                text: 'Transcribe this audio recording word for word. Return only the spoken words, nothing else.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic audio error:', err)
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    const data = await response.json()
    const transcript = data.content?.[0]?.text ?? ''
    return NextResponse.json({ transcript })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
