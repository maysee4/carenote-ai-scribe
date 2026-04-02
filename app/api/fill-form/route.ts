import { NextRequest } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase/server'
import { FORMS } from '@/lib/form-definitions'

const FORM_FILL_SYSTEM_PROMPT = `You are an AI assistant specialised in aged care and NDIS documentation in Australia. You help support workers and registered nurses fill out their AlayaCare forms accurately and compliantly. When given a voice or text description of a visit, incident, or assessment, extract all relevant information and fill out every field of the selected form. Use professional clinical language appropriate for Australian aged care documentation. For Yes/No fields, infer the answer from context. For text fields, generate professional, concise, compliant responses using correct aged care terminology. If information is not mentioned, leave the field blank or write 'Not reported'. Always prioritise accuracy and compliance with Australian aged care standards including the Aged Care Quality Standards 2025. Return the completed form as structured JSON matching the form field names exactly.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { formId, description } = await request.json()
  if (!formId || !description) return new Response('Missing fields', { status: 400 })

  const form = FORMS.find((f) => f.id === formId)
  if (!form) return new Response('Form not found', { status: 404 })

  const allFields = form.sections.flatMap((s) => s.fields)

  const fieldSpec = allFields
    .map((f) => {
      let spec = `${f.id} | ${f.type} | ${f.label}`
      if (f.options) spec += ` | options: ${f.options.join(' / ')}`
      if (f.officeOnly) spec += ' | OFFICE ONLY — output empty string'
      return spec
    })
    .join('\n')

  const userMessage = `Fill out this AlayaCare form based on the description below.
Output ONLY one field per line in this exact format: FIELD_ID|||VALUE
No explanations, no headings, no markdown — just lines of FIELD_ID|||VALUE.

DESCRIPTION:
${description}

FORM: ${form.name}
FIELDS (id | type | label | options if applicable):
${fieldSpec}

RULES:
- Yes/No fields → "Yes" or "No" only (infer from context; use "Not reported" if truly unknown)
- Date fields → DD/MM/YYYY; use today's date where contextually appropriate
- Time fields → HH:MM 24-hour format
- Select fields → use one of the listed options exactly as written
- Text/textarea → professional clinical aged care language, concise and factual
- Number fields → numeric value only, no units
- OFFICE ONLY fields → output empty string
- Missing info → "Not reported" for text, empty string for optional fields
- Do NOT invent clinical details not mentioned in the description
- Output every field ID, even if the value is empty`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: FORM_FILL_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        })

        let buffer = ''

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            buffer += chunk.delta.text

            // Process all complete lines from buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (trimmed.includes('|||')) {
                const sepIdx = trimmed.indexOf('|||')
                const fieldId = trimmed.slice(0, sepIdx).trim()
                const value = trimmed.slice(sepIdx + 3).trim()
                if (fieldId) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ id: fieldId, value })}\n\n`)
                  )
                }
              }
            }
          }
        }

        // Flush remaining buffer
        const trimmed = buffer.trim()
        if (trimmed.includes('|||')) {
          const sepIdx = trimmed.indexOf('|||')
          const fieldId = trimmed.slice(0, sepIdx).trim()
          const value = trimmed.slice(sepIdx + 3).trim()
          if (fieldId) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ id: fieldId, value })}\n\n`)
            )
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        console.error('fill-form stream error:', err)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
