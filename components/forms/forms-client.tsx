'use client'

import { useState, useRef, useEffect } from 'react'
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { FORMS, FormDefinition, FormField } from '@/lib/form-definitions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Role = 'support_worker' | 'nurse'
type Step = 'role' | 'form' | 'input' | 'filling' | 'preview'

// ─── Copy format ─────────────────────────────────────────────────────────────

function formatFormOutput(form: FormDefinition, fields: Record<string, string>): string {
  const today = new Date().toLocaleDateString('en-AU')
  const lines: string[] = [form.name.toUpperCase(), `Date: ${today}`, '']

  for (const section of form.sections) {
    if (section.title) {
      lines.push(section.title)
      lines.push('─'.repeat(section.title.length))
    }
    for (const field of section.fields) {
      const value = fields[field.id]
      if (!value || !value.trim()) continue
      if (field.type === 'textarea') {
        lines.push(`${field.label}:`)
        lines.push(value)
        lines.push('')
      } else {
        lines.push(`${field.label}: ${value}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ─── Role step ───────────────────────────────────────────────────────────────

function RoleStep({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select your role to see the forms available to you.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            role: 'support_worker' as Role,
            emoji: '🧑‍⚕️',
            title: 'Support Worker',
            subtitle: 'Access to 4 forms',
            forms: ['Feedback Form', 'Bristol Bowel Chart', 'Food and Fluid Chart', 'Incident Report'],
          },
          {
            role: 'nurse' as Role,
            emoji: '👩‍⚕️',
            title: 'Nurse / RN',
            subtitle: 'Access to all 9 forms',
            forms: ['All Support Worker forms', 'Critical Incident Form', 'SAH Clinical Assessment', 'Safety Assessment + more'],
          },
        ].map((r) => (
          <motion.button
            key={r.role}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(r.role)}
            className="group flex flex-col items-start gap-3 rounded-xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50"
          >
            <span className="text-3xl">{r.emoji}</span>
            <div>
              <div className="font-semibold text-foreground group-hover:text-amber-700">{r.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{r.subtitle}</div>
            </div>
            <div className="space-y-0.5">
              {r.forms.map((f) => (
                <div key={f} className="text-xs text-muted-foreground">• {f}</div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Form step ───────────────────────────────────────────────────────────────

function FormStep({ forms, onSelect, role }: { forms: FormDefinition[]; onSelect: (f: FormDefinition) => void; role: Role }) {
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
              <div className="font-medium text-sm text-foreground group-hover:text-amber-700 leading-tight">
                {form.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{form.description}</div>
              {form.accessLevel === 'nurse' && (
                <span className="inline-block mt-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                  Nurse/RN only
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Field type icon ──────────────────────────────────────────────────────────

function FieldTypeIcon({ type }: { type: FormField['type'] }) {
  const icons: Record<string, string> = {
    yesno: '☑',
    select: '▾',
    date: '📅',
    time: '🕐',
    number: '🔢',
    text: '✏️',
    textarea: '✏️',
  }
  return (
    <span className="shrink-0 text-base leading-none text-muted-foreground/70 mt-px w-6 text-center">
      {icons[type] ?? '✏️'}
    </span>
  )
}

// ─── Input step ───────────────────────────────────────────────────────────────

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
  const [showFields, setShowFields] = useState(false)

  return (
    <div className="space-y-4">
      {/* Form header */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <span className="text-xl shrink-0">{form.icon}</span>
        <div>
          <div className="font-medium text-amber-900 text-sm">{form.name}</div>
          {form.instructions && (
            <div className="text-xs text-amber-700 mt-0.5 leading-relaxed">{form.instructions}</div>
          )}
        </div>
      </div>

      {/* Description input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Describe what happened during the visit or incident
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Speak or type freely — describe everything relevant to ${form.shortName}. The AI will extract all the details and fill every field for you.`}
            rows={8}
            className={cn(
              'w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none transition-colors',
              isRecording && 'border-red-400 ring-2 ring-red-100'
            )}
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-red-600 bg-white/90 rounded-full px-2.5 py-1 border border-red-200">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Recording…
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
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
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isRecording ? 'Stop Recording' : 'Voice Input'}
        </button>

        <button
          onClick={onGenerate}
          disabled={!description.trim() || isGenerating}
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Starting…</>
          ) : (
            <><Sparkles className="h-4 w-4" />Fill Form with AI</>
          )}
        </button>
      </div>

      {/* Form fields preview — collapsible */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowFields((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-lg font-bold text-foreground">
            What the AI will fill — {form.sections.flatMap((s) => s.fields).length} fields
          </span>
          {showFields ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {showFields && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="divide-y divide-border">
                {form.sections.map((section, si) => (
                  <div key={si} className="px-5 py-4 space-y-0">
                    {section.title && (
                      <div className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3">
                        {section.title}
                      </div>
                    )}
                    {section.fields.map((field, fi) => (
                      <div
                        key={field.id}
                        className={cn(
                          'flex items-center gap-3 py-3',
                          fi < section.fields.length - 1 && 'border-b border-border/60'
                        )}
                      >
                        <FieldTypeIcon type={field.type} />
                        <span className="text-base font-medium text-foreground leading-snug flex-1">
                          {field.label}
                        </span>
                        {field.officeOnly && (
                          <span className="shrink-0 text-xs bg-muted text-muted-foreground rounded px-2 py-0.5">
                            Office only
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[15px] font-medium text-muted-foreground">
        Speak naturally or type freely — the more detail you provide, the better the form will be filled.
      </p>
    </div>
  )
}

// ─── Filling step (live stream view) ─────────────────────────────────────────

function FillingStep({
  form,
  fields,
  filledCount,
}: {
  form: FormDefinition
  fields: Record<string, string>
  filledCount: number
}) {
  const totalFields = form.sections.flatMap((s) => s.fields).length
  const pct = Math.round((filledCount / totalFields) * 100)

  // Auto-scroll the latest filled field into view
  const latestRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    latestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [filledCount])

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is filling your form…
          </div>
          <span className="text-amber-700 text-xs">{filledCount} / {totalFields} fields</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-1.5">
          <motion.div
            className="bg-amber-500 h-1.5 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Live form fields */}
      <div className="space-y-3">
        {form.sections.map((section, si) => (
          <div key={si} className="rounded-xl border border-border bg-card overflow-hidden">
            {section.title && (
              <div className="px-4 py-2 bg-muted/30 border-b border-border text-xs font-semibold text-amber-700 uppercase tracking-wide">
                {section.title}
              </div>
            )}
            <div className="divide-y divide-border/50">
              {section.fields.map((field) => {
                const value = fields[field.id]
                const isFilled = !!value && value.trim() !== ''
                const isOffice = field.officeOnly
                return (
                  <div
                    key={field.id}
                    className={cn(
                      'px-4 py-2.5 flex items-start gap-3 transition-colors',
                      isFilled && 'bg-amber-50/40',
                      isOffice && 'opacity-40'
                    )}
                    ref={isFilled ? latestRef : undefined}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isFilled ? (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">✓</span>
                      ) : (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-muted-foreground/30 text-[10px]">○</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground leading-tight">{field.label}</div>
                      {isFilled && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-foreground font-medium mt-0.5 leading-snug"
                        >
                          {value}
                        </motion.div>
                      )}
                    </div>
                    {!isFilled && (
                      <div className="shrink-0 mt-1 h-3 w-16 rounded bg-muted animate-pulse" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Field editor (preview step) ─────────────────────────────────────────────

function FieldEditor({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const base =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors'

  if (field.type === 'yesno') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">— select —</option>
        <option>Yes</option>
        <option>No</option>
        <option>Not reported</option>
      </select>
    )
  }
  if (field.type === 'select' && field.options) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">— select —</option>
        {field.options.map((o) => <option key={o}>{o}</option>)}
      </select>
    )
  }
  if (field.type === 'textarea') {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cn(base, 'resize-y')} />
  }
  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  )
}

// ─── Preview step ─────────────────────────────────────────────────────────────

function PreviewStep({
  form,
  fields,
  onFieldChange,
  onCopy,
  copied,
  onStartOver,
}: {
  form: FormDefinition
  fields: Record<string, string>
  onFieldChange: (id: string, v: string) => void
  onCopy: () => void
  copied: boolean
  onStartOver: () => void
}) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(form.sections.map((_, i) => i))
  )

  const toggle = (i: number) =>
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const filledTotal = form.sections.flatMap((s) => s.fields).filter((f) => fields[f.id]?.trim()).length
  const total = form.sections.flatMap((s) => s.fields).length

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <ClipboardCheck className="h-4 w-4" />
          <span className="font-medium">{filledTotal}/{total} fields filled — review and copy to AlayaCare</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onStartOver}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New Form
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

      {/* Editable sections */}
      <div className="space-y-3">
        {form.sections.map((section, si) => {
          const isOpen = openSections.has(si)
          const filled = section.fields.filter((f) => fields[f.id]?.trim()).length
          return (
            <div key={si} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => toggle(si)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {section.title || form.name}
                  </span>
                  <span className={cn('text-xs', filled === section.fields.length ? 'text-amber-600' : 'text-muted-foreground')}>
                    {filled}/{section.fields.length}
                  </span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            {field.label}
                            {field.officeOnly && (
                              <span className="text-[10px] bg-muted text-muted-foreground rounded px-1 py-0.5">Office only</span>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Bottom copy */}
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

const STEPS: Step[] = ['role', 'form', 'input', 'filling', 'preview']
const STEP_LABELS: Record<Step, string> = {
  role: 'Role', form: 'Form', input: 'Describe', filling: 'Filling', preview: 'Review',
}

export function FormsClient() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null)
  const [description, setDescription] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [filledFields, setFilledFields] = useState<Record<string, string>>({})
  const [filledCount, setFilledCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const recognitionRef = useRef<any>(null)
  const abortRef = useRef<AbortController | null>(null)

  const availableForms = FORMS.filter(
    (f) => role === 'nurse' || f.accessLevel === 'support_worker'
  )

  function selectRole(r: Role) {
    setRole(r)
    setSelectedForm(null)
    reset()
    setStep('form')
  }

  function selectForm(form: FormDefinition) {
    setSelectedForm(form)
    reset()
    setStep('input')
  }

  function reset() {
    setFilledFields({})
    setFilledCount(0)
    setDescription('')
    abortRef.current?.abort()
  }

  function goBack() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) {
      // Abort any in-flight stream when going back from filling
      if (step === 'filling') abortRef.current?.abort()
      setStep(STEPS[idx - 1] as Step)
    }
  }

  function startRecording() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      toast.error('Voice input not supported in this browser. Please type your description.')
      return
    }
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
      setDescription(committed + interim)
    }
    recognition.onerror = () => { setIsRecording(false); toast.error('Voice recording error.') }
    recognition.onend = () => { setIsRecording(false); if (committed.trim()) setDescription(committed.trim()) }
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

    // Reset and go to filling step
    const initialFields: Record<string, string> = {}
    selectedForm.sections.flatMap((s) => s.fields).forEach((f) => { initialFields[f.id] = '' })
    setFilledFields(initialFields)
    setFilledCount(0)
    setStep('filling')

    abortRef.current?.abort()
    const abort = new AbortController()
    abortRef.current = abort

    try {
      const res = await fetch('/api/fill-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: selectedForm.id, description }),
        signal: abort.signal,
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') {
            setStep('preview')
            return
          }
          try {
            const { id, value: val } = JSON.parse(raw)
            if (id) {
              setFilledFields((prev) => ({ ...prev, [id]: val ?? '' }))
              if (val && val.trim()) setFilledCount((c) => c + 1)
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }

      setStep('preview')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error(err)
      toast.error('Failed to generate form. Please try again.')
      setStep('input')
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

  function startOver() {
    setStep('form')
    reset()
  }

  const visibleSteps: Step[] = step === 'filling'
    ? ['role', 'form', 'input', 'filling', 'preview']
    : ['role', 'form', 'input', 'preview']

  const currentIdx = visibleSteps.indexOf(step)

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

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {(['role', 'form', 'input', 'preview'] as Step[]).map((s, i) => {
          const pastIdx = ['role', 'form', 'input', 'preview'].indexOf(step === 'filling' ? 'input' : step)
          const myIdx = ['role', 'form', 'input', 'preview'].indexOf(s)
          const isActive = s === step || (s === 'input' && step === 'filling')
          const isPast = myIdx < pastIdx
          return (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border text-xs">›</span>}
              <span className={cn(
                'font-medium transition-colors',
                isActive && 'text-amber-600',
                isPast && 'text-muted-foreground',
                !isActive && !isPast && 'text-muted-foreground/40'
              )}>
                {STEP_LABELS[s]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Back */}
      {step !== 'role' && step !== 'filling' && (
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
              isGenerating={false}
            />
          )}

          {step === 'filling' && selectedForm && (
            <FillingStep
              form={selectedForm}
              fields={filledFields}
              filledCount={filledCount}
            />
          )}

          {step === 'preview' && selectedForm && (
            <PreviewStep
              form={selectedForm}
              fields={filledFields}
              onFieldChange={updateField}
              onCopy={copyToClipboard}
              copied={copied}
              onStartOver={startOver}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
