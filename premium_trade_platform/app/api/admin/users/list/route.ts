import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

  const admin = createClient(url, key)
  const { data, error } = await admin
    .from('users')
    .select('id, email, full_name, is_admin, role, subscription_type, subscription_status, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}
