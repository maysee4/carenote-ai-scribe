'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClient, useUpdateClient, useDeleteClient } from '@/hooks/use-clients'
import { useSavedForms, useDeleteSavedForm, useClientKnowledge, useAddKnowledge, useDeleteKnowledge } from '@/hooks/use-saved-forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { initials, formatDate, formatDateTime } from '@/lib/utils'
import {
  ArrowLeft, Edit2, Check, X, Trash2, Plus, ChevronDown, ChevronUp,
  BookOpen, ClipboardList, Brain, Calendar, AlertCircle,
} from 'lucide-react'
import { createClient as supabaseClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import type { Report } from '@/types'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const KNOWLEDGE_CATEGORIES = [
  { value: 'health', label: 'Health Condition', icon: '🩺', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'medications', label: 'Medications', icon: '💊', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'risks', label: 'Risks & Concerns', icon: '⚠️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'preferences', label: 'Preferences', icon: '⭐', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'general', label: 'General Note', icon: '📝', color: 'bg-gray-50 text-gray-700 border-gray-200' },
] as const

type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number]['value']

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: client, isLoading } = useClient(id)
  const { mutate: updateClient, isPending: saving } = useUpdateClient()
  const { mutate: deleteClient } = useDeleteClient()
  const { data: savedForms } = useSavedForms(id)
  const { data: knowledge } = useClientKnowledge(id)
  const { mutate: addKnowledge, isPending: addingKnowledge } = useAddKnowledge()
  const { mutate: deleteKnowledge } = useDeleteKnowledge()
  const { mutate: deleteSavedForm } = useDeleteSavedForm()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', date_of_birth: '', description: '' })
  const [expandedForm, setExpandedForm] = useState<string | null>(null)
  const [showAddKnowledge, setShowAddKnowledge] = useState(false)
  const [newKnowledge, setNewKnowledge] = useState({ category: 'health' as KnowledgeCategory, content: '' })
  const [expandedSection, setExpandedSection] = useState<'reports' | 'forms' | 'knowledge'>('knowledge')

  const supabase = supabaseClient()
  const { data: reports } = useQuery({
    queryKey: ['client-reports', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('reports')
        .select('id, title, status, created_at')
        .eq('client_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      return data as Report[]
    },
  })

  function startEdit() {
    if (!client) return
    setForm({
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      date_of_birth: client.date_of_birth ?? '',
      description: client.description ?? '',
    })
    setEditing(true)
  }

  function handleSave() {
    updateClient({ id, ...form }, { onSuccess: () => setEditing(false) })
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this client? This cannot be undone.')) {
      deleteClient(id, { onSuccess: () => router.push('/clients') })
    }
  }

  function handleAddKnowledge() {
    if (!newKnowledge.content.trim()) return
    addKnowledge(
      { client_id: id, category: newKnowledge.category, content: newKnowledge.content, source: 'manual' },
      {
        onSuccess: () => {
          setNewKnowledge({ category: 'health', content: '' })
          setShowAddKnowledge(false)
        },
      }
    )
  }

  function toggleSection(s: typeof expandedSection) {
    setExpandedSection(prev => prev === s ? prev : s)
  }

  if (isLoading) return (
    <div className="p-6 text-center text-muted-foreground text-base">Loading client…</div>
  )
  if (!client) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground text-base mb-3">Client not found.</p>
      <Link href="/clients"><Button variant="link">Back to Clients</Button></Link>
    </div>
  )

  const getCatConfig = (cat: string) =>
    KNOWLEDGE_CATEGORIES.find(c => c.value === cat) ?? KNOWLEDGE_CATEGORIES[4]

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-5">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Client Profile</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Profile card ──────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarFallback className="bg-[hsl(173,80%,30%)]/10 text-[hsl(173,80%,30%)] text-2xl font-semibold">
                  {initials(client.name)}
                </AvatarFallback>
              </Avatar>

              {!editing ? (
                <>
                  <h2 className="font-bold text-xl">{client.name}</h2>
                  {client.email && <p className="text-base text-muted-foreground mt-0.5">{client.email}</p>}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={startEdit} className="gap-1.5 text-base h-10 px-4">
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="gap-1.5 text-base h-10 px-4 hover:text-destructive hover:border-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-3 text-left mt-2">
                  <div className="space-y-1.5">
                    <Label className="text-base">Name</Label>
                    <Input className="h-12 text-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-base">Email</Label>
                    <Input className="h-12 text-base" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-base">Phone</Label>
                    <Input className="h-12 text-base" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-base">Date of Birth</Label>
                    <Input type="date" className="h-12 text-base" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-base">Client Description</Label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Brief overview of the client — their needs, personality, care requirements..."
                      rows={4}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(173,80%,30%)] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 flex-1 h-11 text-base">
                      <Check className="h-4 w-4" />{saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-11 px-4">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!editing && (
              <>
                <Separator className="mb-4" />
                <div className="space-y-3 text-sm">
                  {client.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-base">{client.phone}</p>
                    </div>
                  )}
                  {client.date_of_birth && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Date of Birth</p>
                      <p className="text-base">{formatDate(client.date_of_birth)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Client Since</p>
                    <p className="text-base">{formatDate(client.created_at)}</p>
                  </div>
                  {client.description && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Description</p>
                      <p className="text-base leading-relaxed">{client.description}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{reports?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Reports</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{savedForms?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Forms</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{knowledge?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Notes</p>
            </div>
          </div>
        </div>

        {/* ── Right column ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* ── Knowledge Base ─────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('knowledge')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[hsl(173,80%,30%)]" />
                <h3 className="font-bold text-base">Knowledge Base</h3>
                <span className="text-sm text-muted-foreground">({knowledge?.length ?? 0} entries)</span>
              </div>
              {expandedSection === 'knowledge' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>

            {expandedSection === 'knowledge' && (
              <div className="border-t border-border">
                {/* Add entry */}
                <div className="px-5 py-4 border-b border-border bg-muted/20">
                  {!showAddKnowledge ? (
                    <button
                      onClick={() => setShowAddKnowledge(true)}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-base font-medium text-muted-foreground hover:border-[hsl(173,80%,30%)] hover:text-[hsl(173,80%,30%)] transition-colors w-full justify-center min-h-[48px]"
                    >
                      <Plus className="h-5 w-5" />
                      Add a note to this client's knowledge base
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-base font-semibold">Category</Label>
                        <div className="flex flex-wrap gap-2">
                          {KNOWLEDGE_CATEGORIES.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => setNewKnowledge(n => ({ ...n, category: cat.value }))}
                              className={cn(
                                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                                newKnowledge.category === cat.value
                                  ? cat.color + ' ring-2 ring-offset-1 ring-current'
                                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
                              )}
                            >
                              <span>{cat.icon}</span>
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-base font-semibold">Note</Label>
                        <textarea
                          value={newKnowledge.content}
                          onChange={(e) => setNewKnowledge(n => ({ ...n, content: e.target.value }))}
                          placeholder={
                            newKnowledge.category === 'health'
                              ? 'Example: "Client has type 2 diabetes diagnosed in 2019. Also has chronic lower back pain from a 2021 injury. Gets breathless when walking more than 50 metres."'
                              : newKnowledge.category === 'medications'
                              ? 'Example: "Takes Metformin 500mg twice daily with meals. Ramipril 5mg once daily in the morning. Allergic to Penicillin — causes severe rash."'
                              : newKnowledge.category === 'risks'
                              ? 'Example: "High fall risk — has fallen twice in the last 3 months, both in the bathroom. Lives alone. Uses a walking frame indoors."'
                              : newKnowledge.category === 'preferences'
                              ? 'Example: "Prefers female carers only. Likes her breakfast at 8am sharp. Enjoys listening to classical music. Does not like being rushed."'
                              : 'Example: "Client has a daughter Sarah who visits every Sunday. Client speaks limited English — prefers Vietnamese. Feels anxious in new environments."'
                          }
                          rows={4}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[hsl(173,80%,30%)] resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAddKnowledge(false)}
                          className="rounded-xl border border-border bg-card px-4 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted transition-colors min-h-[44px]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddKnowledge}
                          disabled={!newKnowledge.content.trim() || addingKnowledge}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(173,80%,30%)] px-5 py-2.5 text-base font-semibold text-white hover:bg-[hsl(173,80%,25%)] transition-colors disabled:opacity-50 min-h-[44px]"
                        >
                          {addingKnowledge ? 'Saving…' : 'Add to Knowledge Base'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Knowledge entries */}
                {!knowledge?.length ? (
                  <div className="py-10 text-center text-muted-foreground text-base">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No knowledge base entries yet.</p>
                    <p className="text-sm mt-1">Add health conditions, medications, risks, and preferences.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {knowledge.map((entry) => {
                      const cat = getCatConfig(entry.category)
                      return (
                        <div key={entry.id} className="px-5 py-4 flex items-start gap-3 group">
                          <span className={cn(
                            'shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-medium mt-0.5',
                            cat.color
                          )}>
                            <span>{cat.icon}</span>
                            {cat.label}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-base leading-relaxed text-foreground">{entry.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.created_at)}</p>
                          </div>
                          <button
                            onClick={() => deleteKnowledge({ id: entry.id, clientId: id })}
                            className="opacity-0 group-hover:opacity-100 shrink-0 flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Saved Forms ─────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('forms')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-base">Saved Forms</h3>
                <span className="text-sm text-muted-foreground">({savedForms?.length ?? 0})</span>
              </div>
              {expandedSection === 'forms' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>

            {expandedSection === 'forms' && (
              <div className="border-t border-border">
                {!savedForms?.length ? (
                  <div className="py-10 text-center text-muted-foreground text-base">
                    <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No saved forms yet.</p>
                    <p className="text-sm mt-1">Complete a form in the Form Filler and save it to this client.</p>
                  </div>
                ) : (() => {
                  // Group forms by form_id so multiples of the same type appear together
                  const grouped = savedForms.reduce<Record<string, typeof savedForms>>((acc, sf) => {
                    if (!acc[sf.form_id]) acc[sf.form_id] = []
                    acc[sf.form_id].push(sf)
                    return acc
                  }, {})

                  return (
                    <div className="divide-y divide-border">
                      {Object.entries(grouped).map(([formId, entries]) => (
                        <div key={formId}>
                          {/* Form type header */}
                          <div className="px-5 py-3 bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-amber-600 shrink-0" />
                              <span className="text-base font-bold text-foreground">{entries[0].form_name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium">
                              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                            </span>
                          </div>

                          {/* Each individual submission */}
                          {entries.map((sf, entryIdx) => (
                            <div key={sf.id} className="border-t border-border/50">
                              <button
                                onClick={() => setExpandedForm(expandedForm === sf.id ? null : sf.id)}
                                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                                    {entries.length - entryIdx}
                                  </div>
                                  <div>
                                    <p className="text-base font-medium text-foreground flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                      {formatDateTime(sf.created_at)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {Object.values(sf.form_fields).filter(v => v && String(v).trim()).length} fields filled
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteSavedForm({ id: sf.id, clientId: id }) }}
                                    className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  {expandedForm === sf.id
                                    ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                                </div>
                              </button>

                              <AnimatePresence>
                                {expandedForm === sf.id && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-5 border-t border-border space-y-3 pt-3">
                                      {sf.original_prompt && (
                                        <div className="rounded-xl bg-muted/30 px-4 py-3">
                                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Original Description</p>
                                          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{sf.original_prompt}</p>
                                        </div>
                                      )}
                                      <div className="space-y-2">
                                        {Object.entries(sf.form_fields)
                                          .filter(([, v]) => v && String(v).trim())
                                          .map(([k, v]) => (
                                            <div key={k} className="flex gap-3">
                                              <span className="text-sm text-muted-foreground shrink-0 min-w-[140px] capitalize">{k.replace(/_/g, ' ')}</span>
                                              <span className="text-sm font-medium text-foreground">{String(v)}</span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* ── Reports ─────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-base">Reports</h3>
                <span className="text-sm text-muted-foreground">({reports?.length ?? 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/reports/new?client=${id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-blue-400 hover:text-blue-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> New Report
                </Link>
                {expandedSection === 'reports' ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </div>
            </button>

            {expandedSection === 'reports' && (
              <div className="border-t border-border">
                {!reports?.length ? (
                  <div className="py-10 text-center text-muted-foreground text-base">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No reports for this client.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {reports.map((r) => (
                      <Link
                        key={r.id}
                        href={`/reports/${r.id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-base">{r.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(r.created_at)}</p>
                        </div>
                        <Badge variant={r.status === 'complete' ? 'success' : r.status === 'processing' ? 'processing' : 'secondary'}>
                          {r.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
