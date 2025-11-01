import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

async function promote({ id, email }: { id?: string; email?: string }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  if (process.env.DEBUG !== '1') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const admin = createClient(url, key)
  const filter = id ? `id.eq.${id}` : `email.eq.${email}`
  const { data, error } = await admin
    .from('users')
    .update({ is_admin: true, role: 'admin', subscription_type: 'premium', subscription_status: 'active' })
    .or(filter)
    .select('id, email, is_admin, role, subscription_type')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ user: data })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, email } = body || {}
  if (!id && !email) return NextResponse.json({ error: 'id or email required' }, { status: 400 })
  return promote({ id, email })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || undefined
  const email = searchParams.get('email') || undefined
  if (!id && !email) return NextResponse.json({ error: 'id or email required' }, { status: 400 })
  return promote({ id, email })
}
