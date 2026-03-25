'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useReport, useDeleteReport } from '@/hooks/use-reports'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDateTime } from '@/lib/utils'
import { ArrowLeft, Trash2, Copy, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'

const statusVariant: Record<string, 'default' | 'processing' | 'success' | 'warning' | 'secondary'> = {
  complete: 'success',
  processing: 'processing',
  draft: 'secondary',
  error: 'warning',
}

export default function ReportViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: report, isLoading } = useReport(id)
  const { mutate: deleteReport } = useDeleteReport()

  function handleCopy() {
    if (report?.content) {
      navigator.clipboard.writeText(report.content)
      toast.success('Copied to clipboard')
    }
  }

  function handleDelete() {
    deleteReport(id, {
      onSuccess: () => router.push('/reports'),
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Report not found.</p>
        <Link href="/reports"><Button variant="link">Back to Reports</Button></Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge variant={statusVariant[report.status] ?? 'secondary'}>{report.status}</Badge>
              {report.client && (
                <Link href={`/clients/${report.client_id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <User className="h-3.5 w-3.5" />
                  {report.client.name}
                </Link>
              )}
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(report.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {report.content && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDelete} className="gap-2 hover:text-destructive hover:border-destructive">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Report content */}
        <div className="lg:col-span-2 space-y-5">
          {report.content ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-4">Generated Report</h2>
              <div className="prose prose-sm max-w-none text-foreground">
                {report.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h3 key={i} className="text-base font-semibold mt-5 mb-2 first:mt-0">{line.slice(3)}</h3>
                  if (line.startsWith('# ')) return <h2 key={i} className="text-lg font-bold mt-5 mb-2 first:mt-0">{line.slice(2)}</h2>
                  if (line.trim() === '') return <div key={i} className="h-2" />
                  return <p key={i} className="text-sm leading-relaxed">{line}</p>
                })}
              </div>
            </div>
          ) : report.status === 'processing' ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center py-12">
              <div className="h-8 w-8 border-2 border-[hsl(173,80%,30%)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Generating report…</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center py-12 text-muted-foreground">
              No report content yet.
            </div>
          )}

          {report.transcript && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">Original Transcript</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{report.transcript}</p>
            </div>
          )}
        </div>

        {/* Sidebar meta */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-medium mb-3 text-sm">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Status</p>
                <Badge variant={statusVariant[report.status] ?? 'secondary'}>{report.status}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Created</p>
                <p>{formatDateTime(report.created_at)}</p>
              </div>
              {report.client && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Client</p>
                    <Link href={`/clients/${report.client_id}`} className="text-[hsl(173,80%,30%)] hover:underline">
                      {report.client.name}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
