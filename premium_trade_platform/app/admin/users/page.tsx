"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth-instant'

type User = {
  id: string
  email: string
  full_name?: string
  is_admin: boolean
  role: string
  subscription_type?: string
  subscription_status?: string
  status?: string
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await fetch('/api/admin/users/list')
      const json = await res.json()
      setUsers(json.users || [])
      setLoading(false)
    }
    load()
  }, [])

  if (!user?.is_admin) return <div className="text-gray-300">Acceso restringido</div>

  const updateUser = async (id: string, updates: Partial<User>) => {
    const res = await fetch('/api/admin/users/update', { method: 'POST', body: JSON.stringify({ id, updates }) })
    const json = await res.json()
    if (json.user) {
      setUsers(prev => prev.map(u => (u.id === id ? json.user : u)))
    }
  }

  const filtered = users.filter(u => (u.email || '').toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">Usuarios</h1>
        <div className="flex gap-2">
          <Input placeholder="Buscar por email" value={q} onChange={e => setQ(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="divide-y divide-gray-800">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-white font-medium">{u.full_name || u.email}</div>
                <div className="text-xs text-gray-400">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={u.is_admin ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/30 text-gray-300'}>{u.is_admin ? 'Admin' : 'Usuario'}</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">{u.subscription_type || 'free'}</Badge>
                <Button size="sm" onClick={() => updateUser(u.id, { is_admin: !u.is_admin, role: !u.is_admin ? 'admin' : 'user' })}>
                  {u.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600"
                  onClick={() => updateUser(u.id, { subscription_type: u.subscription_type === 'premium' ? 'free' : 'premium', subscription_status: 'active' })}
                >
                  {u.subscription_type === 'premium' ? 'Quitar Premium' : 'Dar Premium'}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => updateUser(u.id, { status: u.status === 'banned' ? 'active' : 'banned' })}>
                  {u.status === 'banned' ? 'Desbloquear' : 'Bloquear'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
