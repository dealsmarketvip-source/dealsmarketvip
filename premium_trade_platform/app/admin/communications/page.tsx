"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth-instant'

export default function AdminCommunicationsPage() {
  const { user } = useAuth()
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('Aviso de DealsMarket')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  if (!user?.is_admin) return <div className="text-gray-300">Acceso restringido</div>

  const send = async () => {
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/send-email', { method: 'POST', body: JSON.stringify({ to, subject, message }) })
    const json = await res.json()
    if (json?.success) setResult('Enviado ✅')
    else setResult(json?.error || 'Error')
    setSending(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-white text-xl font-semibold">Comunicaciones (Email)</h1>
      <div className="grid gap-3">
        <Input placeholder="Destinatario (email o coma separada)" value={to} onChange={e => setTo(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
        <Input placeholder="Asunto" value={subject} onChange={e => setSubject(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
        <Textarea placeholder="Mensaje" value={message} onChange={e => setMessage(e.target.value)} className="bg-gray-800 border-gray-700 text-white min-h-40" />
        <Button onClick={send} disabled={sending || !to || !subject || !message}>{sending ? 'Enviando...' : 'Enviar'}</Button>
        {result && <div className="text-sm text-gray-300">{result}</div>}
      </div>
    </div>
  )
}
