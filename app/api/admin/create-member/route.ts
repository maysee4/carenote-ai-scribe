import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { organizationId, email, password, fullName, role } = await request.json()

    if (!organizationId || !email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the requesting user owns the org
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .eq('owner_id', user.id)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Forbidden: you do not own this organization' }, { status: 403 })
    }

    // Use admin client to create auth user
    const adminSupabase = createAdminClient()
    const { data: authUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError || !authUser.user) {
      return NextResponse.json({ error: createError?.message || 'Failed to create user' }, { status: 500 })
    }

    // Insert into organization_members using regular server client
    const { data: member, error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: authUser.user.id,
        role,
        full_name: fullName,
        email,
      })
      .select()
      .single()

    if (memberError) {
      // Roll back: delete the auth user we just created
      await adminSupabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    return NextResponse.json({ member })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
