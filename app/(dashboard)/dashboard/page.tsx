import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: reports }, { data: clients }, { count: totalReports }] = await Promise.all([
    supabase
      .from('reports')
      .select('*, client:clients(id, name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('clients').select('id').limit(1),
    supabase.from('reports').select('*', { count: 'exact', head: true }).is('deleted_at', null),
  ])

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <DashboardClient
      recentReports={reports || []}
      totalReports={totalReports || 0}
      totalClients={totalClients || 0}
      userName={name}
    />
  )
}
