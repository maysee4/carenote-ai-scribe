'use client'

import Link from 'next/link'
import { Report } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, FileText, Users, ArrowRight, Mic } from 'lucide-react'

interface Props {
  recentReports: Report[]
  totalReports: number
  totalClients: number
  userName: string
}

const statusVariant: Record<string, 'default' | 'processing' | 'success' | 'warning' | 'secondary'> = {
  complete: 'success',
  processing: 'processing',
  draft: 'secondary',
  error: 'warning',
}

export function DashboardClient({ recentReports, totalReports, totalClients, userName }: Props) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hey {userName} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your care notes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]/10">
              <FileText className="h-4 w-4 text-[hsl(173,80%,30%)]" />
            </div>
            <span className="text-sm text-muted-foreground">Total Reports</span>
          </div>
          <p className="text-3xl font-bold">{totalReports}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]/10">
              <Users className="h-4 w-4 text-[hsl(173,80%,30%)]" />
            </div>
            <span className="text-sm text-muted-foreground">Total Clients</span>
          </div>
          <p className="text-3xl font-bold">{totalClients}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
          <p className="text-sm text-muted-foreground mb-3">Ready to document?</p>
          <Link href="/reports/new">
            <Button className="w-full gap-2">
              <Mic className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Reports</h2>
          <Link href="/reports" className="flex items-center gap-1 text-sm text-[hsl(173,80%,30%)] hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentReports.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No reports yet.</p>
            <Link href="/reports/new">
              <Button variant="link" className="mt-2 gap-1">
                <Plus className="h-4 w-4" /> Create your first report
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentReports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{report.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {report.client?.name ?? 'No client'} · {formatDate(report.created_at)}
                  </p>
                </div>
                <Badge variant={statusVariant[report.status] ?? 'secondary'} className="ml-4 shrink-0">
                  {report.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
