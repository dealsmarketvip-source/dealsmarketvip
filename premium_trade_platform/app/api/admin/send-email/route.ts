import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { to, subject, message, html } = await req.json()
    if (!to || !subject || (!message && !html)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const bodyHtml = html || `<div style="font-family:Arial,sans-serif;line-height:1.6"><p>${String(message).replace(/\n/g,'<br/>')}</p></div>`
    const res = await sendEmail({ to, subject, html: bodyHtml })
    return NextResponse.json(res)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
