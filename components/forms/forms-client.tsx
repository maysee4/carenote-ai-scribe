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
  Save,
  User,
  ArrowRight,
  MessageSquare,
  ListChecks,
  SkipForward,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { FORMS, FormDefinition, FormField } from '@/lib/form-definitions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useClients } from '@/hooks/use-clients'
import { useSaveForm } from '@/hooks/use-saved-forms'
import { useVoiceInput } from '@/hooks/use-voice-input'

type Role = 'support_worker' | 'nurse'
type Step = 'role' | 'form' | 'client' | 'input' | 'filling' | 'stepwise' | 'preview'
type FillMode = 'standard' | 'stepwise'

// ─── Example prompts per form ─────────────────────────────────────────────────

const EXAMPLE_PROMPTS: Record<string, string> = {
  feedback: `Example: "I visited Mrs Thompson at 10am. She was in a good mood and very happy with the service. We worked on her goal of getting dressed independently — she managed to put on her cardigan by herself today which is great progress. She mentioned she would like her breakfast a little earlier next time. No risks or concerns noted during the visit."`,
  bristol_bowel: `Example: "Client had a bowel movement at 2:15pm. It was a type 4 on the Bristol scale — smooth and soft, normal consistency. Medium volume. No blood or mucous observed. Client was comfortable throughout."`,
  food_fluid: `Example: "Client had breakfast at 8am — two slices of toast with vegemite and a cup of tea, approximately 200ml. At lunch they had vegetable soup and a glass of water, about 250ml. Client ate well and finished most of their meal. Total fluid for today roughly 800ml. Weight is 68kg."`,
  incident: `Example: "At approximately 3pm I arrived to find Mrs Green had slipped in the bathroom. She was sitting on the floor and appeared shaken but not injured. I helped her to a chair and checked for any pain — she said her hip felt a little sore but she could move it. I called the office immediately and stayed with her until her daughter arrived at 3:45pm. Client was calm by the time I left."`,
  critical_incident: `Example: "At 9:30am I found Mr Davis unresponsive in his bedroom. I called 000 immediately and started CPR as instructed. Paramedics arrived at 9:42am and took over. His daughter Sarah was contacted at 9:35am and arrived at the hospital. The office was notified at 9:33am. Mr Davis was admitted to St Vincent's Hospital. I stayed on scene until a colleague arrived to support the family."`,
  sah_clinical: `Example: "Assessment conducted with Mrs Wong, 78 years old, at her home. She has moderate dementia diagnosed 3 years ago and her daughter is her substitute decision maker and was present. Mrs Wong has type 2 diabetes, hypertension, and chronic back pain. She takes Metformin, Ramipril, and Panadol Osteo. No allergies. Last GP visit was two weeks ago. She requires assistance with showering, dressing, and meal preparation. Mobility is good with a walking frame. No recent hospital admissions."`,
  safety_assessment: `Example: "Safety assessment for Mr Johnson, 82 years old. He lives alone in a single-storey home. There is a step at the front door — no handrail present. The bathroom has no grab rails. He has had two falls in the last three months, both in the kitchen. He has good vision with glasses but says he sometimes feels dizzy when standing. He has smoke detectors that were tested last month. He has a pendant alarm but does not wear it regularly."`,
  skin_integrity: `Example: "Skin assessment for Mrs Patel. I noticed a small reddened area approximately 2cm on her right heel, not broken. She reports mild discomfort when lying on it. The surrounding skin looks dry. She has been in bed more than usual this week due to a cold. She has diabetes so extra monitoring required. I repositioned her and documented the area."`,
  medication_admin: `Example: "Administered Mrs Clarke's 8am medications as prescribed: Metoprolol 25mg, Atorvastatin 20mg, and Vitamin D 1000IU. She swallowed all medications with water without difficulty. She was alert and cooperative. No side effects observed. She mentioned she sometimes forgets her evening dose so I reminded her about her dosette box."`,
}

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
    <div className="space-y-5">
      <p className="text-base text-muted-foreground">Select your role to see the forms available to you.</p>
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
            className="group flex flex-col items-start gap-3 rounded-xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50 min-h-[160px]"
          >
            <span className="text-4xl">{r.emoji}</span>
            <div>
              <div className="text-lg font-semibold text-foreground group-hover:text-amber-700">{r.title}</div>
              <div className="text-base text-muted-foreground mt-0.5">{r.subtitle}</div>
            </div>
            <div className="space-y-1">
              {r.forms.map((f) => (
                <div key={f} className="text-sm text-muted-foreground">• {f}</div>
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
      <p className="text-base text-muted-foreground">
        {role === 'nurse' ? 'All 9 forms available.' : '4 forms available for Support Workers.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {forms.map((form) => (
          <motion.button
            key={form.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(form)}
            className="group flex items-start gap-3 rounded-xl border-2 border-border bg-card p-5 text-left transition-colors hover:border-amber-400 hover:bg-amber-50/50 min-h-[80px]"
          >
            <span className="text-3xl shrink-0 mt-0.5">{form.icon}</span>
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground group-hover:text-amber-700 leading-tight">
                {form.name}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{form.description}</div>
              {form.accessLevel === 'nurse' && (
                <span className="inline-block mt-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
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

// ─── Client step ──────────────────────────────────────────────────────────────

function ClientStep({
  onSelect,
  onSkip,
}: {
  onSelect: (clientId: string, clientName: string) => void
  onSkip: () => void
}) {
  const { data: clients, isLoading } = useClients()
  const [search, setSearch] = useState('')

  const filtered = clients?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-base font-medium text-blue-900">Which client is this form for?</p>
        <p className="text-sm text-blue-700 mt-0.5">Choosing a client saves the completed form to their profile so you can view it later.</p>
      </div>

      <input
        type="text"
        placeholder="Search clients by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
      />

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading clients…</div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {filtered?.map((client) => (
            <motion.button
              key={client.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(client.id, client.name)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-amber-400 hover:bg-amber-50/50 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(173,80%,30%)]/10 text-[hsl(173,80%,30%)] font-semibold text-base">
                {client.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-medium text-foreground">{client.name}</div>
                {client.email && <div className="text-sm text-muted-foreground">{client.email}</div>}
              </div>
            </motion.button>
          ))}
          {!filtered?.length && (
            <p className="py-4 text-center text-muted-foreground text-sm">No clients found.</p>
          )}
        </div>
      )}

      <button
        onClick={onSkip}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-base font-medium text-muted-foreground hover:border-amber-400 hover:text-amber-700 transition-colors"
      >
        <SkipForward className="h-4 w-4" />
        Skip — no client (just fill the form)
      </button>
    </div>
  )
}

// ─── Field type pill ──────────────────────────────────────────────────────────

function FieldTypePill({ type }: { type: FormField['type'] }) {
  const config: Record<string, { icon: string; label: string; colour: string }> = {
    yesno:    { icon: '☑',  label: 'Yes / No',   colour: 'bg-green-50 text-green-700 border-green-200' },
    select:   { icon: '▾',  label: 'Select',      colour: 'bg-blue-50 text-blue-700 border-blue-200' },
    date:     { icon: '📅', label: 'Date',        colour: 'bg-purple-50 text-purple-700 border-purple-200' },
    time:     { icon: '🕐', label: 'Time',        colour: 'bg-purple-50 text-purple-700 border-purple-200' },
    number:   { icon: '🔢', label: 'Number',      colour: 'bg-orange-50 text-orange-700 border-orange-200' },
    text:     { icon: '✏️', label: 'Text field',  colour: 'bg-amber-50 text-amber-700 border-amber-200' },
    textarea: { icon: '✏️', label: 'Text field',  colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const c = config[type] ?? config.text
  return (
    <span className={cn('shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold', c.colour)}>
      <span className="text-sm leading-none">{c.icon}</span>
      {c.label}
    </span>
  )
}

// ─── Input step ───────────────────────────────────────────────────────────────

function InputStep({
  form,
  description,
  setDescription,
  onGenerate,
  fillMode,
  setFillMode,
  selectedClientName,
}: {
  form: FormDefinition
  description: string
  setDescription: (v: string) => void
  onGenerate: () => void
  fillMode: FillMode
  setFillMode: (m: FillMode) => void
  selectedClientName?: string
}) {
  const [showFields, setShowFields] = useState(false)
  const example = EXAMPLE_PROMPTS[form.id] ?? ''
  const voice = useVoiceInput((text) => setDescription(text))

  return (
    <div className="space-y-5">
      {/* Form header */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <span className="text-2xl shrink-0">{form.icon}</span>
        <div>
          <div className="text-base font-semibold text-amber-900">{form.name}</div>
          {selectedClientName && (
            <div className="text-sm text-amber-700 mt-0.5 flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              For: <strong>{selectedClientName}</strong>
            </div>
          )}
          {form.instructions && (
            <div className="text-sm text-amber-700 mt-1 leading-relaxed">{form.instructions}</div>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground">Choose how to fill the form</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setFillMode('standard')}
            className={cn(
              'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors',
              fillMode === 'standard'
                ? 'border-amber-500 bg-amber-50'
                : 'border-border bg-card hover:border-amber-300'
            )}
          >
            <MessageSquare className={cn('h-6 w-6 mt-0.5 shrink-0', fillMode === 'standard' ? 'text-amber-600' : 'text-muted-foreground')} />
            <div>
              <div className="text-base font-semibold text-foreground">Standard Fill</div>
              <div className="text-sm text-muted-foreground mt-0.5">Describe everything at once — AI fills all fields for you</div>
            </div>
          </button>
          <button
            onClick={() => setFillMode('stepwise')}
            className={cn(
              'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors',
              fillMode === 'stepwise'
                ? 'border-amber-500 bg-amber-50'
                : 'border-border bg-card hover:border-amber-300'
            )}
          >
            <ListChecks className={cn('h-6 w-6 mt-0.5 shrink-0', fillMode === 'stepwise' ? 'text-amber-600' : 'text-muted-foreground')} />
            <div>
              <div className="text-base font-semibold text-foreground">Step by Step</div>
              <div className="text-sm text-muted-foreground mt-0.5">Answer one question at a time — AI reviews at the end</div>
            </div>
          </button>
        </div>
      </div>

      {fillMode === 'standard' && (
        <>
          {/* Description input */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-foreground">
              Describe what happened during the visit or incident
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={example || `Speak or type freely — describe everything relevant to ${form.shortName}. The AI will extract all the details and fill every field for you.`}
                rows={8}
                className={cn(
                  'w-full rounded-xl border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70',
                  'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none transition-colors',
                  voice.isRecording && 'border-red-400 ring-2 ring-red-100'
                )}
              />
              {voice.isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-red-600 bg-white/90 rounded-full px-2.5 py-1 border border-red-200">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Recording…
                </div>
              )}
              {voice.isTranscribing && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-amber-700 bg-white/90 rounded-full px-2.5 py-1 border border-amber-200">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Transcribing…
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={voice.isBusy ? voice.stop : voice.start}
              disabled={voice.isTranscribing}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-medium transition-colors min-h-[48px]',
                voice.isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : voice.isTranscribing
                  ? 'border border-amber-200 bg-amber-50 text-amber-700 cursor-not-allowed'
                  : 'border border-border bg-card text-foreground hover:border-amber-400 hover:text-amber-700'
              )}
            >
              {voice.isRecording ? <MicOff className="h-5 w-5" /> : voice.isTranscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
              {voice.isRecording ? 'Stop Recording' : voice.isTranscribing ? 'Transcribing…' : 'Voice Input'}
            </button>

            <button
              onClick={onGenerate}
              disabled={!description.trim() || false}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {false ? (
                <><Loader2 className="h-5 w-5 animate-spin" />Starting…</>
              ) : (
                <><Sparkles className="h-5 w-5" />Fill Form with AI</>
              )}
            </button>
          </div>
        </>
      )}

      {fillMode === 'stepwise' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 space-y-3">
          <p className="text-base font-medium text-amber-900">
            In Step by Step mode, each question will appear one at a time. You type or speak your answer, then move to the next question. At the end, AI reviews all your answers and fills the form properly.
          </p>
          <button
            onClick={onGenerate}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-white hover:bg-amber-600 transition-colors min-h-[48px]"
          >
            <ArrowRight className="h-5 w-5" />
            Start Step by Step
          </button>
        </div>
      )}

      {/* Form fields preview — collapsible */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowFields((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-base font-bold text-foreground">
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
                  <div key={si} className="px-5 py-4">
                    {section.title && (
                      <div className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3">
                        {section.title}
                      </div>
                    )}
                    {section.fields.map((field, fi) => (
                      <div
                        key={field.id}
                        className={cn(
                          'flex items-start gap-3 py-3',
                          fi < section.fields.length - 1 && 'border-b border-border/60'
                        )}
                      >
                        <div className="pt-0.5 shrink-0">
                          <FieldTypePill type={field.type} />
                        </div>
                        <span className="text-base font-medium text-foreground leading-snug flex-1">
                          {field.label}
                          {field.officeOnly && (
                            <span className="ml-2 text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 align-middle">
                              Office only
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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

  const latestRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    latestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [filledCount])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-amber-800 font-medium text-base">
            <Loader2 className="h-5 w-5 animate-spin" />
            AI is filling your form…
          </div>
          <span className="text-amber-700 text-sm">{filledCount} / {totalFields} fields</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-2">
          <motion.div
            className="bg-amber-500 h-2 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {form.sections.map((section, si) => (
          <div key={si} className="rounded-xl border border-border bg-card overflow-hidden">
            {section.title && (
              <div className="px-4 py-2 bg-muted/30 border-b border-border text-sm font-semibold text-amber-700 uppercase tracking-wide">
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
                      'px-4 py-3 flex items-start gap-3 transition-colors',
                      isFilled && 'bg-amber-50/40',
                      isOffice && 'opacity-40'
                    )}
                    ref={isFilled ? latestRef : undefined}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isFilled ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs">✓</span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-muted-foreground/30 text-xs">○</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-muted-foreground leading-tight">{field.label}</div>
                      {isFilled && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-base text-foreground font-medium mt-0.5 leading-snug"
                        >
                          {value}
                        </motion.div>
                      )}
                    </div>
                    {!isFilled && (
                      <div className="shrink-0 mt-1.5 h-3 w-16 rounded bg-muted animate-pulse" />
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

// ─── Stepwise filling step ────────────────────────────────────────────────────

function StepwiseStep({
  form,
  onComplete,
}: {
  form: FormDefinition
  onComplete: (answers: Record<string, string>) => void
}) {
  const allFields = form.sections.flatMap((s) => s.fields).filter((f) => !f.officeOnly)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const voice = useVoiceInput((text) => setCurrentAnswer(text))

  const currentField = allFields[currentIdx]
  const progress = Math.round(((currentIdx) / allFields.length) * 100)

  function handleNext() {
    const newAnswers = { ...answers, [currentField.id]: currentAnswer.trim() }
    setAnswers(newAnswers)
    setCurrentAnswer('')
    if (currentIdx + 1 >= allFields.length) {
      onComplete(newAnswers)
    } else {
      setCurrentIdx(currentIdx + 1)
    }
  }

  function handleSkip() {
    const newAnswers = { ...answers, [currentField.id]: '' }
    setAnswers(newAnswers)
    setCurrentAnswer('')
    if (currentIdx + 1 >= allFields.length) {
      onComplete(newAnswers)
    } else {
      setCurrentIdx(currentIdx + 1)
    }
  }

  if (!currentField) return null

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium text-base text-foreground">Question {currentIdx + 1} of {allFields.length}</span>
          <span>{progress}% done</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-amber-500 h-2 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 space-y-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{form.icon}</span>
            <div>
              <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
                {form.sections.find(s => s.fields.includes(currentField))?.title || form.shortName}
              </div>
              <p className="text-xl font-bold text-amber-900 leading-snug">{currentField.label}</p>
              <FieldTypePill type={currentField.type} />
            </div>
          </div>

          {/* Answer input */}
          <div className="relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={`Type your answer here — speak naturally, for example:\n"Yes, the client was comfortable…" or "At 2:30pm, we noticed…"`}
              rows={4}
              className={cn(
                'w-full rounded-xl border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70',
                'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none',
                voice.isRecording && 'border-red-400 ring-2 ring-red-100'
              )}
            />
            {voice.isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-red-600 bg-white rounded-full px-2.5 py-1 border border-red-200">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Recording…
              </div>
            )}
            {voice.isTranscribing && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-amber-700 bg-white rounded-full px-2.5 py-1 border border-amber-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Transcribing…
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={voice.isBusy ? voice.stop : voice.start}
              disabled={voice.isTranscribing}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors min-h-[48px]',
                voice.isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : voice.isTranscribing
                  ? 'border border-amber-200 bg-amber-50 text-amber-700 cursor-not-allowed'
                  : 'border border-border bg-white text-foreground hover:border-amber-400 hover:text-amber-700'
              )}
            >
              {voice.isRecording ? <MicOff className="h-5 w-5" /> : voice.isTranscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
              {voice.isRecording ? 'Stop' : voice.isTranscribing ? 'Transcribing…' : 'Voice'}
            </button>

            <button
              onClick={handleSkip}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-base font-medium text-muted-foreground hover:border-amber-400 hover:text-amber-700 transition-colors min-h-[48px]"
            >
              <SkipForward className="h-5 w-5" />
              Skip
            </button>

            <button
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-white hover:bg-amber-600 transition-colors min-h-[48px]"
            >
              {currentIdx + 1 >= allFields.length ? (
                <><Sparkles className="h-5 w-5" />Finish &amp; Let AI Review</>
              ) : (
                <><ArrowRight className="h-5 w-5" />Next Question</>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Previous answers */}
      {currentIdx > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your answers so far</p>
          </div>
          <div className="divide-y divide-border max-h-40 overflow-y-auto">
            {allFields.slice(0, currentIdx).map((field) => (
              <div key={field.id} className="px-4 py-2.5">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{answers[field.id] || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Field editor (preview step) ─────────────────────────────────────────────

function FieldEditor({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const base =
    'w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors min-h-[48px]'

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
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cn(base, 'resize-y min-h-[80px]')} />
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
  originalPrompt,
  onFieldChange,
  onCopy,
  copied,
  onStartOver,
  onSaveToClient,
  selectedClientName,
  isSaving,
  onRegenerate,
}: {
  form: FormDefinition
  fields: Record<string, string>
  originalPrompt: string
  onFieldChange: (id: string, v: string) => void
  onCopy: () => void
  copied: boolean
  onStartOver: () => void
  onSaveToClient?: () => void
  selectedClientName?: string
  isSaving?: boolean
  onRegenerate: (editRequest: string) => void
}) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(form.sections.map((_, i) => i))
  )
  const [showOriginalPrompt, setShowOriginalPrompt] = useState(false)
  const [editRequest, setEditRequest] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [satisfactionState, setSatisfactionState] = useState<'pending' | 'happy' | 'editing'>('pending')
  const [editSection, setEditSection] = useState('')
  const [editDetail, setEditDetail] = useState('')

  const toggle = (i: number) =>
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const filledTotal = form.sections.flatMap((s) => s.fields).filter((f) => fields[f.id]?.trim()).length
  const total = form.sections.flatMap((s) => s.fields).length

  async function handleEditRequest() {
    if (!editRequest.trim()) return
    setIsRegenerating(true)
    await onRegenerate(editRequest)
    setEditRequest('')
    setIsRegenerating(false)
    setSatisfactionState('pending')
  }

  async function handleSectionEdit() {
    if (!editSection || !editDetail.trim()) return
    setIsRegenerating(true)
    await onRegenerate(`Please edit the ${editSection} section: ${editDetail}`)
    setEditSection('')
    setEditDetail('')
    setIsRegenerating(false)
    setSatisfactionState('pending')
  }

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-base text-amber-800">
            <ClipboardCheck className="h-5 w-5 shrink-0" />
            <span className="font-medium">{filledTotal}/{total} fields filled</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onStartOver}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors min-h-[44px]"
            >
              <RefreshCw className="h-4 w-4" />
              New Form
            </button>
            {selectedClientName && onSaveToClient && (
              <button
                onClick={onSaveToClient}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl bg-[hsl(173,80%,30%)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[hsl(173,80%,25%)] transition-colors disabled:opacity-60 min-h-[44px]"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Saving…' : `Save to ${selectedClientName}`}
              </button>
            )}
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors min-h-[44px]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Form'}
            </button>
          </div>
        </div>
      </div>

      {/* Original prompt (collapsible) */}
      {originalPrompt && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setShowOriginalPrompt(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          >
            <span className="text-base font-semibold text-foreground">Your original description</span>
            {showOriginalPrompt ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showOriginalPrompt && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-border">
                  <p className="text-base text-muted-foreground mt-3 leading-relaxed whitespace-pre-wrap">{originalPrompt}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Edit with AI */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
        <p className="text-base font-semibold text-blue-900">Want to change something?</p>
        <p className="text-sm text-blue-700">Tell the AI what to edit — it will update the form while keeping your original answers.</p>
        <textarea
          value={editRequest}
          onChange={(e) => setEditRequest(e.target.value)}
          placeholder={`Example: "Please change the goal progress section to say she struggled today and needed more support" or "The incident time was 3pm not 2pm"`}
          rows={3}
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
        />
        <button
          onClick={handleEditRequest}
          disabled={!editRequest.trim() || isRegenerating}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[48px]"
        >
          {isRegenerating ? (
            <><Loader2 className="h-5 w-5 animate-spin" />Updating form…</>
          ) : (
            <><Sparkles className="h-5 w-5" />Update Form with AI</>
          )}
        </button>
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
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground">
                    {section.title || form.name}
                  </span>
                  <span className={cn('text-sm', filled === section.fields.length ? 'text-amber-600' : 'text-muted-foreground')}>
                    {filled}/{section.fields.length}
                  </span>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
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
                    <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                          <label className="text-base font-medium text-foreground flex items-center gap-2">
                            {field.label}
                            {field.officeOnly && (
                              <span className="text-xs bg-muted text-muted-foreground rounded px-1 py-0.5">Office only</span>
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

      {/* Are you happy with this form? */}
      <div className="rounded-xl border-2 border-border bg-card p-5 space-y-4">
        <p className="text-lg font-bold text-foreground">Are you happy with this form?</p>
        {satisfactionState === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSatisfactionState('happy')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-base font-semibold text-white hover:bg-green-600 transition-colors min-h-[48px]"
            >
              <ThumbsUp className="h-5 w-5" />
              Yes, looks good!
            </button>
            <button
              onClick={() => setSatisfactionState('editing')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 px-5 py-3 text-base font-semibold text-amber-800 hover:bg-amber-100 transition-colors min-h-[48px]"
            >
              <ThumbsDown className="h-5 w-5" />
              No, I want to edit a section
            </button>
          </div>
        )}
        {satisfactionState === 'happy' && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <p className="text-base font-medium text-green-800">Great! Your form is ready. Copy it or save it to the client above.</p>
          </div>
        )}
        {satisfactionState === 'editing' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-base font-medium text-foreground">Which section needs editing?</label>
              <select
                value={editSection}
                onChange={(e) => setEditSection(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[48px]"
              >
                <option value="">— Select a section —</option>
                {form.sections.map((s, i) => (
                  <option key={i} value={s.title || form.name}>{s.title || form.name}</option>
                ))}
                <option value="the whole form">The whole form</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-base font-medium text-foreground">What needs to change?</label>
              <textarea
                value={editDetail}
                onChange={(e) => setEditDetail(e.target.value)}
                placeholder={`Example: "The client was not happy with the service, please change that" or "Add that the client fell asleep during the visit"`}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSatisfactionState('pending')}
                className="rounded-xl border border-border bg-card px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted transition-colors min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSectionEdit}
                disabled={!editSection || !editDetail.trim() || isRegenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-base font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50 min-h-[48px]"
              >
                {isRegenerating ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Updating…</>
                ) : (
                  <><Sparkles className="h-5 w-5" />Update This Section</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom copy */}
      <button
        onClick={onCopy}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 text-base font-bold text-white hover:bg-amber-600 transition-colors min-h-[56px]"
      >
        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        {copied ? 'Copied to clipboard!' : 'Copy Completed Form to Clipboard'}
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const STEPS: Step[] = ['role', 'form', 'client', 'input', 'filling', 'preview']
const STEP_LABELS: Record<Step, string> = {
  role: 'Role', form: 'Form', client: 'Client', input: 'Describe', filling: 'Filling', stepwise: 'Questions', preview: 'Review',
}

export function FormsClient() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [filledFields, setFilledFields] = useState<Record<string, string>>({})
  const [filledCount, setFilledCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [fillMode, setFillMode] = useState<FillMode>('standard')
  const abortRef = useRef<AbortController | null>(null)

  const { mutate: saveForm, isPending: isSaving } = useSaveForm()

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
    setStep('client')
  }

  function selectClient(clientId: string, clientName: string) {
    setSelectedClientId(clientId)
    setSelectedClientName(clientName)
    setStep('input')
  }

  function skipClient() {
    setSelectedClientId(null)
    setSelectedClientName(null)
    setStep('input')
  }

  function reset() {
    setFilledFields({})
    setFilledCount(0)
    setDescription('')
    abortRef.current?.abort()
  }

  function goBack() {
    const map: Record<Step, Step | null> = {
      role: null,
      form: 'role',
      client: 'form',
      input: 'client',
      filling: 'input',
      stepwise: 'input',
      preview: 'input',
    }
    const prev = map[step]
    if (prev) {
      if (step === 'filling' || step === 'stepwise') abortRef.current?.abort()
      setStep(prev)
    }
  }


  async function runFormFill(prompt: string): Promise<Record<string, string>> {
    if (!selectedForm) throw new Error('No form selected')

    const initialFields: Record<string, string> = {}
    selectedForm.sections.flatMap((s) => s.fields).forEach((f) => { initialFields[f.id] = '' })
    setFilledFields(initialFields)
    setFilledCount(0)

    abortRef.current?.abort()
    const abort = new AbortController()
    abortRef.current = abort

    const res = await fetch('/api/fill-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId: selectedForm.id, description: prompt }),
      signal: abort.signal,
    })

    if (!res.ok || !res.body) throw new Error('Request failed')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    const result: Record<string, string> = { ...initialFields }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const raw = line.slice(6).trim()
        if (raw === '[DONE]') return result
        try {
          const { id, value: val } = JSON.parse(raw)
          if (id) {
            result[id] = val ?? ''
            setFilledFields((prev) => ({ ...prev, [id]: val ?? '' }))
            if (val && val.trim()) setFilledCount((c) => c + 1)
          }
        } catch { /* ignore */ }
      }
    }
    return result
  }

  async function generateForm() {
    if (!selectedForm) return
    if (fillMode === 'stepwise') {
      setStep('stepwise')
      return
    }
    if (!description.trim()) { toast.error('Please provide a description first.'); return }

    setStep('filling')
    try {
      await runFormFill(description)
      setStep('preview')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error(err)
      toast.error('Failed to generate form. Please try again.')
      setStep('input')
    }
  }

  async function handleStepwiseComplete(answers: Record<string, string>) {
    if (!selectedForm) return
    // Build a structured description from step-by-step answers
    const allFields = selectedForm.sections.flatMap((s) => s.fields)
    const structuredDescription = allFields
      .filter((f) => answers[f.id])
      .map((f) => `${f.label}: ${answers[f.id]}`)
      .join('\n')

    const fullPrompt = `The nurse answered each question individually. Here are their answers:\n\n${structuredDescription}`
    setDescription(fullPrompt)
    setStep('filling')
    try {
      await runFormFill(fullPrompt)
      setStep('preview')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      toast.error('Failed to generate form. Please try again.')
      setStep('input')
    }
  }

  async function handleRegenerate(editRequest: string) {
    if (!selectedForm || !description) return
    const prompt = `Original description:\n${description}\n\nEdit request:\n${editRequest}`
    setStep('filling')
    try {
      await runFormFill(prompt)
      setStep('preview')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      toast.error('Failed to update form.')
      setStep('preview')
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

  function handleSaveToClient() {
    if (!selectedForm || !selectedClientId) return
    saveForm({
      client_id: selectedClientId,
      form_id: selectedForm.id,
      form_name: selectedForm.name,
      form_fields: filledFields,
      original_prompt: description,
    })
  }

  function updateField(id: string, value: string) {
    setFilledFields((prev) => ({ ...prev, [id]: value }))
  }

  function startOver() {
    setStep('form')
    reset()
  }

  const breadcrumbSteps: Step[] = ['role', 'form', 'client', 'input', 'preview']

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Form Filler</h1>
          <p className="text-base text-muted-foreground mt-1">
            Describe a visit or incident — AI fills your AlayaCare forms instantly.
          </p>
        </div>
        <div className="hidden sm:flex shrink-0 items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-wrap">
        {breadcrumbSteps.map((s, i) => {
          const activeStep = step === 'filling' || step === 'stepwise' ? 'input' : step
          const myIdx = breadcrumbSteps.indexOf(s)
          const activeIdx = breadcrumbSteps.indexOf(activeStep)
          const isActive = s === activeStep
          const isPast = myIdx < activeIdx
          return (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border text-xs">›</span>}
              <span className={cn(
                'font-medium transition-colors text-base',
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
      {step !== 'role' && step !== 'filling' && step !== 'stepwise' && (
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-base text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
        >
          <ChevronLeft className="h-5 w-5" />
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

          {step === 'form' && role && (
            <FormStep forms={availableForms} onSelect={selectForm} role={role} />
          )}

          {step === 'client' && (
            <ClientStep onSelect={selectClient} onSkip={skipClient} />
          )}

          {step === 'input' && selectedForm && (
            <InputStep
              form={selectedForm}
              description={description}
              setDescription={setDescription}
              onGenerate={generateForm}
              fillMode={fillMode}
              setFillMode={setFillMode}
              selectedClientName={selectedClientName ?? undefined}
            />
          )}

          {step === 'filling' && selectedForm && (
            <FillingStep
              form={selectedForm}
              fields={filledFields}
              filledCount={filledCount}
            />
          )}

          {step === 'stepwise' && selectedForm && (
            <StepwiseStep
              form={selectedForm}
              onComplete={handleStepwiseComplete}
            />
          )}

          {step === 'preview' && selectedForm && (
            <PreviewStep
              form={selectedForm}
              fields={filledFields}
              originalPrompt={description}
              onFieldChange={updateField}
              onCopy={copyToClipboard}
              copied={copied}
              onStartOver={startOver}
              onSaveToClient={selectedClientId ? handleSaveToClient : undefined}
              selectedClientName={selectedClientName ?? undefined}
              isSaving={isSaving}
              onRegenerate={handleRegenerate}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
