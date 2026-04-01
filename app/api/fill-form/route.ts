import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase/server'
import { FORMS } from '@/lib/form-definitions'

const FORM_FILL_SYSTEM_PROMPT = `You are an AI assistant specialized in aged care and NDIS documentation in Australia. You help support workers and registered nurses fill out their AlayaCare forms accurately and compliantly. When given a voice or text description of a visit or incident, extract the relevant information and fill out every field of the selected form. Use professional clinical language appropriate for aged care documentation. For Yes/No fields, infer the answer from context. For text fields, generate professional, concise, compliant responses. If information is not mentioned, leave the field blank or write 'Not reported'. Always prioritize accuracy and compliance with Australian aged care standards.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { formId, description } = await request.json()
    if (!formId || !description) {
      return NextResponse.json({ error: 'Missing formId or description' }, { status: 400 })
    }

    const form = FORMS.find((f) => f.id === formId)
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

    // Build flat field list for the AI prompt
    const fieldsList = form.sections.flatMap((section) =>
      section.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        ...(field.options ? { options: field.options } : {}),
        ...(field.officeOnly ? { instruction: 'OFFICE ONLY — leave as empty string' } : {}),
      }))
    )

    const userMessage = `Fill out the following AlayaCare form based on this description of what occurred:

DESCRIPTION:
${description}

FORM: ${form.name}

Return a JSON object where keys are field IDs and values are the filled content.
Rules:
- Yes/No fields: use exactly "Yes" or "No" (infer from context; if unclear write "Not reported")
- Date fields: use DD/MM/YYYY format; if not mentioned use today's date where appropriate
- Time fields: use HH:MM 24-hour format
- Select fields: use one of the provided options exactly as written
- Text/textarea fields: write professional, concise clinical documentation
- Number fields: numeric value only
- Office-only fields: always use empty string ""
- If information is genuinely not in the description, use "Not reported" for text or "" for optional fields
- Do NOT invent clinical details that were not mentioned

FIELDS:
${JSON.stringify(fieldsList, null, 2)}

Respond with ONLY a valid JSON object. No explanation, no markdown fences — just the JSON.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: FORM_FILL_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

    // Strip any accidental markdown fences
    const rawText = content.text.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON object found in Claude response')

    const filledFields = JSON.parse(jsonMatch[0])
    return NextResponse.json({ fields: filledFields })
  } catch (error) {
    console.error('Form fill error:', error)
    return NextResponse.json({ error: 'Form filling failed' }, { status: 500 })
  }
}
