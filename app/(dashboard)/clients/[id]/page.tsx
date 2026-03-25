'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClient, useUpdateClient, useDeleteClient } from '@/hooks/use-clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { initials, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit2, Check, X, Trash2, Plus } from 'lucide-react'
import { createClient as supabaseClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import type { Report } from '@/types'
import { Badge } from '@/components/ui/badge'

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: client, isLoading } = useClient(id)
  const { mutate: updateClient, isPending: saving } = useUpdateClient()
  const { mutate: deleteClient } = useDeleteClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', date_of_birth: '' })

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
    setForm({ name: client.name, email: client.email ?? '', phone: client.phone ?? '', date_of_birth: client.date_of_birth ?? '' })
    setEditing(true)
  }

  function handleSave() {
    updateClient({ id, ...form }, { onSuccess: () => setEditing(false) })
  }

  function handleDelete() {
    deleteClient(id, { onSuccess: () => router.push('/clients') })
  }

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading…</div>
  if (!client) return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">Client not found.</p>
      <Link href="/clients"><Button variant="link">Back</Button></Link>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Client Profile</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar className="h-16 w-16 mb-3">
                <AvatarFallback className="bg-[hsl(173,80%,30%)]/10 text-[hsl(173,80%,30%)] text-xl font-semibold">
                  {initials(client.name)}
                </AvatarFallback>
              </Avatar>
              {!editing ? (
                <>
                  <h2 className="font-semibold text-lg">{client.name}</h2>
                  {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={startEdit} className="gap-1.5">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 hover:text-destructive hover:border-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-3 text-left mt-2">
                  <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 flex-1"><Check className="h-3.5 w-3.5" />{saving ? 'Saving…' : 'Save'}</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              )}
            </div>
            {!editing && (
              <>
                <Separator className="mb-4" />
                <div className="space-y-3 text-sm">
                  {client.phone && <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p><p>{client.phone}</p></div>}
                  {client.date_of_birth && <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Date of Birth</p><p>{formatDate(client.date_of_birth)}</p></div>}
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Client Since</p><p>{formatDate(client.created_at)}</p></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reports */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold">Reports</h3>
              <Link href={`/reports/new?client=${id}`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New Report
                </Button>
              </Link>
            </div>
            {!reports?.length ? (
              <div className="py-10 text-center text-muted-foreground text-sm">No reports for this client.</div>
            ) : (
              <div className="divide-y divide-border">
                {reports.map((r) => (
                  <Link key={r.id} href={`/reports/${r.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                    </div>
                    <Badge variant={r.status === 'complete' ? 'success' : r.status === 'processing' ? 'processing' : 'secondary'}>
                      {r.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
