'use client'

import { useDeletedReports, useRestoreReport, usePermanentlyDeleteReport } from '@/hooks/use-reports'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react'

export default function DeletedPage() {
  const { data: reports, isLoading } = useDeletedReports()
  const { mutate: restore } = useRestoreReport()
  const { mutate: permanentlyDelete } = usePermanentlyDeleteReport()

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deleted Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Items here are soft-deleted and can be restored.</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading…</div>
      ) : !reports?.length ? (
        <div className="py-12 text-center">
          <Trash2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nothing in trash.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 mb-5">
            <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-700">Permanently deleted items cannot be recovered.</p>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {report.client?.name ?? 'No client'} · Deleted {formatDate(report.deleted_at!)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => restore(report.id)} className="gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" /> Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => permanentlyDelete(report.id)}
                      className="gap-1.5 hover:text-destructive hover:border-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
