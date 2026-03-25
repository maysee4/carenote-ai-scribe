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
import { Mic, MicOff, Square, Loader2, FileText, ArrowLeft, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDuration } from '@/lib/utils'

type Step = 'record' | 'transcribe' | 'generate' | 'done'

export default function NewReportPage() {
  const router = useRouter()
  const supabase = createClient()
  const { data: clients } = useClients()

  const [step, setStep] = useState<Step>('record')
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState('')
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<NodeJS.Timeout | null>(null)

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
      setIsRecording(true)
      setDuration(0)
      timer.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch {
      toast.error('Microphone access denied')
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop()
    if (timer.current) clearInterval(timer.current)
    setIsRecording(false)
    setStep('transcribe')
  }, [])

  async function handleTranscribe() {
    if (!audioBlob) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('audio', audioBlob, 'recording.webm')
      const res = await fetch('/api/transcribe', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTranscript(data.transcript)
      setStep('generate')
      toast.success('Transcription complete')
    } catch (err) {
      toast.error('Transcription failed — you can type the transcript manually')
      setStep('generate')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (!transcript.trim()) return toast.error('Transcript is empty')
    if (!title.trim()) return toast.error('Please add a report title')
    setLoading(true)

    // Create report record
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
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              accumulated += parsed.text
              setReport(accumulated)
            } catch { /* ignore */ }
          }
        }
      }

      setStep('done')
      toast.success('Report generated!')
      router.push(`/reports/${reportRecord.id}`)
    } catch {
      toast.error('Report generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Report</h1>
          <p className="text-sm text-muted-foreground">Record audio · Transcribe · Generate</p>
        </div>
      </div>

      {/* Report details */}
      <div className="rounded-xl border border-border bg-card p-6 mb-5">
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
      </div>

      {/* Step 1: Record */}
      <div className="rounded-xl border border-border bg-card p-6 mb-5">
        <h2 className="font-semibold mb-1">Step 1: Record Audio</h2>
        <p className="text-sm text-muted-foreground mb-5">Press record and speak naturally about the visit.</p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={step !== 'record' && !isRecording}
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-ring/40',
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-[hsl(173,80%,30%)] hover:bg-[hsl(173,80%,25%)]',
              (step !== 'record' && !isRecording) && 'opacity-40 cursor-not-allowed'
            )}
          >
            {isRecording ? <Square className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
          </button>
          {isRecording && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-mono">{formatDuration(duration)}</span>
            </div>
          )}
          {audioBlob && !isRecording && (
            <p className="text-sm text-muted-foreground">
              Recording ready ({formatDuration(duration)})
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {isRecording ? 'Click to stop recording' : 'Click to start recording'}
          </p>
        </div>
      </div>

      {/* Step 2: Transcribe */}
      <div className={cn('rounded-xl border border-border bg-card p-6 mb-5 transition-opacity', step === 'record' && 'opacity-50')}>
        <h2 className="font-semibold mb-1">Step 2: Transcribe</h2>
        <p className="text-sm text-muted-foreground mb-4">Convert your recording to text, or type/paste manually.</p>

        {step === 'transcribe' && !transcript && (
          <Button onClick={handleTranscribe} disabled={loading || !audioBlob} className="mb-4 gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? 'Transcribing…' : 'Transcribe with AI'}
          </Button>
        )}

        <Textarea
          placeholder="Transcript will appear here, or type it manually…"
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value)
            if (step === 'record') setStep('transcribe')
            if (e.target.value && step === 'transcribe') setStep('generate')
          }}
          rows={6}
        />
      </div>

      {/* Step 3: Generate */}
      <div className={cn('rounded-xl border border-border bg-card p-6', (step === 'record' || step === 'transcribe' && !transcript) && 'opacity-50')}>
        <h2 className="font-semibold mb-1">Step 3: Generate Report</h2>
        <p className="text-sm text-muted-foreground mb-4">Claude will transform your transcript into a professional care report.</p>

        <Button
          onClick={handleGenerate}
          disabled={loading || !transcript.trim() || !title.trim()}
          className="gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          {loading ? 'Generating…' : 'Generate Report'}
        </Button>

        {report && (
          <div className="mt-4 rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
            {report}
          </div>
        )}
      </div>
    </div>
  )
}
