"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth-instant'
import { unifiedDb } from '@/lib/unified-database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Notif {
  id: string
  title: string
  message: string
  created_at?: string
  read?: boolean
}

export default function AdminNotifications() {
  const { user } = useAuth()
  const [items, setItems] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      const list = await unifiedDb.getNotifications(user.id, { limit: 50 })
      setItems(list as any)
      setLoading(false)
    }
    load()
  }, [user])

  if (!user?.is_admin) return <div className="text-gray-300">Acceso restringido</div>

  const markAll = async () => {
    if (!user) return
    await unifiedDb.markAllNotificationsAsRead(user.id)
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">Notificaciones</h1>
        <Button size="sm" onClick={markAll} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Marcar todas como leídas</Button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-400">Sin notificaciones</div>
      ) : (
        <div className="space-y-3">
          {items.map(n => (
            <Card key={n.id} className={`border ${n.read ? 'border-gray-700' : 'border-primary'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{n.title}</div>
                    <div className="text-gray-300 text-sm">{n.message}</div>
                  </div>
                  <div className="text-xs text-gray-400">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
