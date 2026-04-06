import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: orgs } = await admin
    .from('organizations')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)

  const isOrgOwner = (orgs?.length ?? 0) > 0

  return <DashboardShell isOrgOwner={isOrgOwner}>{children}</DashboardShell>
}
