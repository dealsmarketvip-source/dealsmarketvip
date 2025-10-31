"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { unifiedDb } from '@/lib/unified-database'
import { useAuth } from '@/hooks/use-auth-instant'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Product {
  id: string
  title: string
  price?: number
  status?: string
  category?: string
  created_at?: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const items = await unifiedDb.getProducts()
      setProducts(items)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (!user?.is_admin) {
    return <div className="text-center text-gray-300">Acceso restringido</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">Panel de Administración</h1>
        <Link href="/marketplace">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Ir al Marketplace</Button>
        </Link>
      </div>

      <div>
        <h2 className="text-white text-lg mb-3">Artículos recientes</h2>
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-gray-400">No hay artículos</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-white font-medium">{p.title}</div>
                  <div className="text-xs text-gray-400">
                    {p.category || 'Sin categoría'} · {p.created_at ? new Date(p.created_at).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.status && (
                    <Badge variant="outline" className="border-gray-600 text-gray-300">{p.status}</Badge>
                  )}
                  <Link href={`/admin/products/${p.id}`}>
                    <Button size="sm">Ver</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
