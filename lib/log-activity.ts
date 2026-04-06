'use client'

import { createClient } from '@/lib/supabase/client'

export async function logActivity(action: string, details: Record<string, any>) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Look up the user's organization membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, full_name')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!membership) return

    await supabase.from('activity_logs').insert({
      organization_id: membership.organization_id,
      user_id: user.id,
      user_name: membership.full_name,
      action,
      details,
    })
  } catch {
    // Silent fail — activity logging should never break the main flow
  }
}
