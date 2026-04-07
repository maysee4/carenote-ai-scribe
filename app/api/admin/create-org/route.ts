import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, description, address } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Clinic name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('organizations')
      .insert({
        owner_id: user.id,
        name,
        description: description || null,
        address: address || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mark user as org owner in auth metadata so sidebar shows Admin link instantly
    const adminSupabase = createAdminClient()
    await adminSupabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, is_org_owner: true },
    })

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
