'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReports, useDeleteReport } from '@/hooks/use-reports'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, Search, FileText, Trash2, Eye } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'processing' | 'success' | 'warning' | 'secondary'> = {
  complete: 'success',
  processing: 'processing',
  draft: 'secondary',
  error: 'warning',
}

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports()
  const { mutate: deleteReport } = useDeleteReport()
  const [search, setSearch] = useState('')

  const filtered = reports?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.client?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">{reports?.length ?? 0} total</p>
        </div>
        <Link href="/reports/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </Link>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading…</div>
        ) : !filtered?.length ? (
          <div className="py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{search ? 'No results found.' : 'No reports yet.'}</p>
            {!search && (
              <Link href="/reports/new">
                <Button variant="link" className="mt-2 gap-1">
                  <Plus className="h-4 w-4" /> Create your first
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((report) => (
              <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{report.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {report.client?.name ?? 'No client'} · {formatDate(report.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Badge variant={statusVariant[report.status] ?? 'secondary'}>{report.status}</Badge>
                  <Link href={`/reports/${report.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive"
                    onClick={() => deleteReport(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
