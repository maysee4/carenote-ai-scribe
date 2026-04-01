'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Copy,
  Check,
  ChevronLeft,
  Loader2,
  Sparkles,
  RefreshCw,
  ClipboardCheck,
} from 'lucide-react'
import { FORMS, FormDefinition, FormField } from '@/lib/form-definitions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Role = 'support_worker' | 'nurse'
type Step = 'role' | 'form' | 'input' | 'preview'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFormOutput(form: FormDefinition, fields: Record<string, string>): string {
  const today = new Date().toLocaleDateString('en-AU')
  let out = `${form.name.toUpperCase()}\n${'═'.repeat(form.name.length)}\nCompleted: ${today}\n`

  for (const section of form.sections) {
    out += '\n'
    if (section.title) {
      out += `${section.title}\n${'─'.repeat(section.title.length)}\n`
    }
    for (const field of section.fields) {
      const value = fields[field.id]
      if (value && value.trim() && value !== '') {
        out += `${field.label}: ${value}\n`
      }
    }
  }

  return out.trim()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoleStep({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select your role to see the forms available to you.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('support_worker')}
          className="group flex flex-col items-start gap-3 rounded-xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50"
        >
          <span className="text-3xl">🧑‍⚕️</span>
          <div>
            <div className="font-semibold text-foreground group-hover:text-amber-700">Support Worker</div>
            <div className="text-sm text-muted-foreground mt-0.5">Access to 4 forms</div>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <div>• Feedback Form</div>
            <div>• Bristol Bowel Chart</div>
            <div>• Food and Fluid Chart</div>
            <div>• Incident Report</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('nurse')}
          className="group flex flex-col items-start gap-3 rounded-xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50"
        >
          <span className="text-3xl">👩‍⚕️</span>
          <div>
            <div className="font-semibold text-foreground group-hover:text-amber-700">Nurse / RN</div>
            <div className="text-sm text-muted-foreground mt-0.5">Access to all 9 forms</div>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <div>• All Support Worker forms</div>
            <div>• Critical Incident Form</div>
            <div>• SAH Clinical Assessment</div>
            <div>• Safety Assessment + more</div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

function FormStep({
  forms,
  onSelect,
  role,
}: {
  forms: FormDefinition[]
  onSelect: (form: FormDefinition) => void
  role: Role
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {role === 'nurse' ? 'All 9 forms available.' : '4 forms available for Support Workers.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {forms.map((form) => (
          <motion.button
            key={form.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(form)}
            className="group flex items-start gap-3 rounded-xl border-2 border-border bg-card p-4 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50"
          >
            <span className="text-2xl shrink-0 mt-0.5">{form.icon}</span>
            <div className="min-w-0">
              <div className="font-medium text-foreground text-sm group-hover:text-amber-700 leading-tight">
                {form.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{form.description}</div>
              {form.accessLevel === 'nurse' && (
                <span className="inline-block mt-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                  Nurse/RN
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function InputStep({
  form,
  description,
  setDescription,
  isRecording,
  onStartRecording,
  onStopRecording,
  onGenerate,
  isGenerating,
}: {
  form: FormDefinition
  description: string
  setDescription: (v: string) => void
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onGenerate: () => void
  isGenerating: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <span className="text-xl shrink-0">{form.icon}</span>
        <div>
          <div className="font-medium text-amber-900 text-sm">{form.name}</div>
          <div className="text-xs text-amber-700 mt-0.5">{form.description}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Describe what happened during the visit or incident
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I visited Margaret at 10am. She was in good spirits and ate all her breakfast. She mentioned her knee was a bit sore. We went through her morning exercises and she managed them well. No concerns to report..."
            rows={8}
            className={cn(
              'w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
              'resize-none transition-colors',
              isRecording && 'border-red-400 ring-2 ring-red-200'
            )}
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-full px-2.5 py-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Recording…
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'border border-border bg-card text-foreground hover:border-amber-400 hover:text-amber-700'
          )}
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Voice Input
            </>
          )}
        </button>

        <button
          onClick={onGenerate}
          disabled={!description.trim() || isGenerating}
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Filling form…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Fill Form with AI
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Speak naturally or type freely — the more detail you provide, the better the form will be filled.
      </p>
    </div>
  )
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string
  onChange: (v: string) => void
}) {
  const baseInput =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors'

  if (field.type === 'yesno') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={baseInput}>
        <option value="">— select —</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Not reported">Not reported</option>
      </select>
    )
  }

  if (field.type === 'select' && field.options) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={baseInput}>
        <option value="">— select —</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={cn(baseInput, 'resize-y')}
      />
    )
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInput}
    />
  )
}

function PreviewStep({
  form,
  fields,
  onFieldChange,
  onCopy,
  copied,
  onRegenerate,
  isGenerating,
}: {
  form: FormDefinition
  fields: Record<string, string>
  onFieldChange: (id: string, value: string) => void
  onCopy: () => void
  copied: boolean
  onRegenerate: () => void
  isGenerating: boolean
}) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(form.sections.map((_, i) => i))
  )

  const toggleSection = (i: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <ClipboardCheck className="h-4 w-4" />
          <span className="font-medium">Review and edit, then copy to AlayaCare</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Regenerate
          </button>
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-600 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy Form'}
          </button>
        </div>
      </div>

      {/* Form sections */}
      <div className="space-y-3">
        {form.sections.map((section, si) => {
          const isOpen = openSections.has(si)
          const filledCount = section.fields.filter((f) => fields[f.id] && fields[f.id].trim()).length
          return (
            <div key={si} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => toggleSection(si)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {section.title || form.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {filledCount}/{section.fields.length} fields
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        {field.label}
                        {field.officeOnly && (
                          <span className="text-[10px] bg-muted text-muted-foreground rounded px-1 py-0.5">
                            Office only
                          </span>
                        )}
                      </label>
                      <FieldEditor
                        field={field}
                        value={fields[field.id] ?? ''}
                        onChange={(v) => onFieldChange(field.id, v)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom copy button */}
      <button
        onClick={onCopy}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied to clipboard!' : 'Copy Completed Form to Clipboard'}
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const STEPS: Step[] = ['role', 'form', 'input', 'preview']
const STEP_LABELS: Record<Step, string> = { role: 'Role', form: 'Form', input: 'Describe', preview: 'Review' }

export function FormsClient() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null)
  const [description, setDescription] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filledFields, setFilledFields] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const recognitionRef = useRef<any>(null)

  const availableForms = FORMS.filter(
    (f) => role === 'nurse' || f.accessLevel === 'support_worker'
  )

  function selectRole(r: Role) {
    setRole(r)
    setSelectedForm(null)
    setFilledFields({})
    setDescription('')
    setStep('form')
  }

  function selectForm(form: FormDefinition) {
    setSelectedForm(form)
    setFilledFields({})
    setDescription('')
    setStep('input')
  }

  function goBack() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  function startRecording() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      toast.error('Voice input is not supported in this browser. Please type your description.')
      return
    }

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-AU'

    let committed = ''

    recognition.onresult = (event: any) => {
      let interim = ''
      committed = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          committed += event.results[i][0].transcript + ' '
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setDescription(committed + interim)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      toast.error('Voice recording error. Please try again.')
    }

    recognition.onend = () => {
      setIsRecording(false)
      if (committed.trim()) setDescription(committed.trim())
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  async function generateForm() {
    if (!selectedForm || !description.trim()) {
      toast.error('Please provide a description first.')
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch('/api/fill-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: selectedForm.id, description }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const data = await res.json()
      setFilledFields(data.fields ?? {})
      setStep('preview')
    } catch {
      toast.error('Failed to generate form. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  function copyToClipboard() {
    if (!selectedForm) return
    const text = formatFormOutput(selectedForm, filledFields)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    toast.success('Form copied — paste it into AlayaCare!')
  }

  function updateField(id: string, value: string) {
    setFilledFields((prev) => ({ ...prev, [id]: value }))
  }

  const currentStepIndex = STEPS.indexOf(step)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Form Filler</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Describe a visit or incident — AI fills your AlayaCare forms instantly.
          </p>
        </div>
        <div className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </div>
      </div>

      {/* Step breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {STEPS.map((s, i) => {
          const isActive = s === step
          const isPast = i < currentStepIndex
          return (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border text-xs">›</span>}
              <span
                className={cn(
                  'font-medium transition-colors',
                  isActive && 'text-amber-600',
                  isPast && 'text-muted-foreground',
                  !isActive && !isPast && 'text-muted-foreground/40'
                )}
              >
                {STEP_LABELS[s]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Back button */}
      {step !== 'role' && (
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {step === 'role' && <RoleStep onSelect={selectRole} />}

          {step === 'form' && (
            <FormStep forms={availableForms} onSelect={selectForm} role={role!} />
          )}

          {step === 'input' && selectedForm && (
            <InputStep
              form={selectedForm}
              description={description}
              setDescription={setDescription}
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onGenerate={generateForm}
              isGenerating={isGenerating}
            />
          )}

          {step === 'preview' && selectedForm && (
            <PreviewStep
              form={selectedForm}
              fields={filledFields}
              onFieldChange={updateField}
              onCopy={copyToClipboard}
              copied={copied}
              onRegenerate={generateForm}
              isGenerating={isGenerating}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
