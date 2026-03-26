'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useClients } from '@/hooks/use-clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Square, Loader2, FileText, ArrowLeft, Keyboard } from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDuration } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const TEMPLATE = `Client name:
Date of visit/shift:
Support worker:

Activities completed:
-

Client's mood and wellbeing:


Any incidents or concerns:


Medications administered:


Follow-up actions required:
`

export default function NewReportPage() {
  const router = useRouter()
  const supabase = createClient()
  const { data: clients } = useClients()

  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'record' | 'type'>('record')

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null)
  const finalTranscript = useRef('')

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunks.current = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start(250)
      mediaRecorder.current = recorder

      // Live transcription via Web Speech API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI: any =
        typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

      if (SpeechRecognitionAPI) {
        const rec = new SpeechRecognitionAPI()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = 'en-AU'
        finalTranscript.current = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onresult = (event: any) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript.current += event.results[i][0].transcript + ' '
            } else {
              interim += event.results[i][0].transcript
            }
          }
          setTranscript(finalTranscript.current + interim)
        }
        rec.onerror = () => { /* silent — user may have revoked mic */ }
        rec.start()
        recognition.current = rec
      }

      setIsRecording(true)
      setDuration(0)
      timer.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch {
      toast.error('Microphone access denied')
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop()
    recognition.current?.stop()
    if (timer.current) clearInterval(timer.current)
    setIsRecording(false)
    setTranscript((prev) => finalTranscript.current.trim() || prev)
  }, [])

  async function handleGenerate() {
    if (!transcript.trim()) return toast.error('No notes — record or type something first')
    if (!title.trim()) return toast.error('Please add a report title')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: reportRecord, error } = await supabase
      .from('reports')
      .insert({
        user_id: user!.id,
        client_id: clientId || null,
        title,
        transcript,
        status: 'processing',
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create report')
      setLoading(false)
      return
    }

    const selectedClient = clients?.find((c) => c.id === clientId)

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          clientName: selectedClient?.name,
          reportId: reportRecord.id,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const reader = res.body!.getReader()
      while (true) {
        const { done } = await reader.read()
        if (done) break
      }

      toast.success('Report generated!')
      router.push(`/reports/${reportRecord.id}`)
    } catch {
      toast.error('Report generation failed')
      setLoading(false)
    }
  }

  const hasTranscript = transcript.trim().length > 0

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Report</h1>
          <p className="text-sm text-muted-foreground">Record your voice or type your notes — Claude generates the report</p>
        </div>
      </motion.div>

      {/* Report details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-border bg-card p-6 mb-5"
      >
        <h2 className="font-semibold mb-4">Report Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Morning care visit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Client (optional)</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client…" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Mode toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex rounded-xl border border-border bg-card p-1 mb-5 gap-1"
      >
        {(['record', 'type'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              mode === m
                ? 'bg-[hsl(173,80%,30%)] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {m === 'record' ? <Mic className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
            {m === 'record' ? 'Record Audio' : 'Type Notes'}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Record panel */}
        {mode === 'record' && (
          <motion.div
            key="record"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 mb-5"
          >
            <div className="flex flex-col items-center gap-4 py-2">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-full focus:outline-none focus:ring-4 focus:ring-ring/40 transition-colors',
                  isRecording ? 'bg-red-500' : 'bg-[hsl(173,80%,30%)]'
                )}
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ repeat: isRecording ? Infinity : 0, duration: 1.2 }}
                >
                  {isRecording
                    ? <Square className="h-7 w-7 text-white" />
                    : <Mic className="h-7 w-7 text-white" />
                  }
                </motion.div>
              </motion.button>

              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="rec"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-mono font-medium">{formatDuration(duration)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Speaking… tap to stop</p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-muted-foreground"
                  >
                    {audioBlob ? `Recording ready · ${formatDuration(duration)}` : 'Tap to start recording'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Live / editable transcript */}
            <AnimatePresence>
              {(transcript.length > 0 || isRecording) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 overflow-hidden"
                >
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    {isRecording ? '🎙 Live transcript' : 'Transcript (editable before generating)'}
                  </Label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Your words will appear here as you speak…"
                    rows={5}
                    className="text-sm resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Type panel */}
        {mode === 'type' && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 mb-5"
          >
            <Label className="font-semibold mb-1 block">Your Notes</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Fill in as much or as little as you have — Claude will structure it into a full NDIS report.
            </p>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={TEMPLATE}
              rows={14}
              className="text-sm font-mono resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can use the template above or write freely — just describe what happened.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Report button */}
      <AnimatePresence>
        {hasTranscript && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleGenerate}
              disabled={loading || !title.trim()}
              whileHover={!loading && title.trim() ? { scale: 1.02 } : {}}
              whileTap={!loading && title.trim() ? { scale: 0.97 } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-white transition-opacity',
                loading || !title.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              )}
              style={{ backgroundColor: '#0a7c6d' }}
            >
              {loading
                ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating Report…</>
                : <><FileText className="h-5 w-5" /> Generate Report</>
              }
            </motion.button>
            {!title.trim() && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Add a report title above to generate
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
