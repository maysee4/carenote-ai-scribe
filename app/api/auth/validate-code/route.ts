import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ valid: false, error: 'No code provided' })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('org_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('claimed', false)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Invalid or already used code' })
  }
  return NextResponse.json({ valid: true, org_name: data.org_name })
}
