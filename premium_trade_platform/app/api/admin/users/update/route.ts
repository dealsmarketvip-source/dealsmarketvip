import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { id, updates } = await req.json()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

  const allowed: Record<string, boolean> = {
    is_admin: true,
    role: true,
    subscription_type: true,
    subscription_status: true,
    status: true,
    full_name: true
  }
  const safeUpdates: Record<string, any> = {}
  Object.keys(updates || {}).forEach(k => { if (allowed[k]) safeUpdates[k] = updates[k] })

  const admin = createClient(url, key)
  const { data, error } = await admin
    .from('users')
    .update(safeUpdates)
    .eq('id', id)
    .select('id, email, full_name, is_admin, role, subscription_type, subscription_status, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ user: data })
}
