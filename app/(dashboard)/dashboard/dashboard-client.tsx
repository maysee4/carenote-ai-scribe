'use client'

import Link from 'next/link'
import { Report } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Plus, FileText, Users, ArrowRight, Mic } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Hey {userName} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your care notes.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FileText, label: 'Total Reports', value: totalReports, delay: 0.05 },
          { icon: Users, label: 'Total Clients', value: totalClients, delay: 0.1 },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: stat.delay }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            className="rounded-xl border border-border bg-card p-5 cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]/10">
                <stat.icon className="h-4 w-4 text-[hsl(173,80%,30%)]" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between"
        >
          <p className="text-sm text-muted-foreground mb-3">Ready to document?</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Link href="/reports/new">
              <Button className="w-full gap-2">
                <Mic className="h-4 w-4" />
                New Report
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
        className="rounded-xl border border-border bg-card"
      >
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
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                <Link
                  href={`/reports/${report.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                >
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
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
