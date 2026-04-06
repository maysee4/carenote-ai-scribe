import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { code, userId } = await req.json()
  if (!code || !userId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()

  // Re-validate code is still unclaimed
  const { data: codeData, error: codeError } = await admin
    .from('org_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('claimed', false)
    .single()

  if (codeError || !codeData) {
    return NextResponse.json({ error: 'Invalid or already used code' }, { status: 400 })
  }

  // Create the organization
  const { error: orgError } = await admin
    .from('organizations')
    .insert({ owner_id: userId, name: codeData.org_name, code: code.toUpperCase() })

  if (orgError) {
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }

  // Mark code as claimed
  await admin
    .from('org_codes')
    .update({ claimed: true, claimed_by: userId })
    .eq('code', code.toUpperCase())

  return NextResponse.json({ success: true })
}
