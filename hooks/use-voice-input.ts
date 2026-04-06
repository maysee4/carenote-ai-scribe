'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'

type VoiceState = 'idle' | 'recording' | 'transcribing'

export function useVoiceInput(onResult: (text: string) => void) {
  const [state, setState] = useState<VoiceState>('idle')
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const isRecording = state === 'recording'
  const isTranscribing = state === 'transcribing'
  const isBusy = isRecording || isTranscribing

  function hasSpeechRecognition() {
    return !!(
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    )
  }

  async function startMediaRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg'

      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop())

        if (chunksRef.current.length === 0) {
          setState('idle')
          return
        }

        setState('transcribing')
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType })
          const fd = new FormData()
          fd.append('audio', blob, `recording.${mimeType.split('/')[1]}`)

          const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
          if (!res.ok) throw new Error('Transcription failed')
          const { transcript } = await res.json()
          if (transcript?.trim()) {
            onResult(transcript.trim())
          } else {
            toast.error('Could not hear anything — please try again.')
          }
        } catch {
          toast.error('Transcription failed — please type instead.')
        } finally {
          setState('idle')
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setState('recording')
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        toast.error('Microphone permission denied. Please allow microphone access and try again.')
      } else {
        toast.error('Could not start recording. Please type instead.')
      }
      setState('idle')
    }
  }

  function startSpeechRecognition() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-AU'
    let committed = ''

    recognition.onresult = (event: any) => {
      committed = ''
      let interim = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) committed += event.results[i][0].transcript + ' '
        else interim += event.results[i][0].transcript
      }
      onResult(committed + interim)
    }

    recognition.onerror = (e: any) => {
      setState('idle')
      if (e.error !== 'aborted') toast.error('Voice recording error — please try again.')
    }

    recognition.onend = () => {
      setState('idle')
      if (committed.trim()) onResult(committed.trim())
    }

    recognitionRef.current = recognition
    recognition.start()
    setState('recording')
  }

  function start() {
    if (hasSpeechRecognition()) {
      startSpeechRecognition()
    } else {
      startMediaRecorder()
    }
  }

  function stop() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
    // state will be set by the onend/onstop handlers
    if (state === 'recording' && !mediaRecorderRef.current && !recognitionRef.current) {
      setState('idle')
    }
  }

  return { start, stop, state, isRecording, isTranscribing, isBusy }
}
