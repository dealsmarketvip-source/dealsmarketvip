"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { unifiedDb } from '@/lib/unified-database'
import { useAuth } from '@/hooks/use-auth-instant'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface Product {
  id: string
  title: string
  description?: string
  price?: number
  status?: 'draft' | 'active' | 'paused' | 'sold'
  images?: string[]
  category?: string
  created_at?: string
}

export default function AdminProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<Product['status']>('active')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const items = await unifiedDb.getProducts()
      const found = items.find((p: any) => p.id === id)
      if (!found) return router.replace('/admin')
      setProduct(found)
      setStatus(found.status || 'active')
    }
    load()
  }, [id, router])

  if (!user?.is_admin) return <div className="text-gray-300">Acceso restringido</div>
  if (!product) return <div className="text-gray-400">Cargando...</div>

  const saveStatus = async () => {
    setSaving(true)
    try {
      // Persist if Supabase is available, otherwise update local mock
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mock_products')
        if (stored) {
          const arr = JSON.parse(stored)
          const idx = arr.findIndex((p: any) => p.id === product.id)
          if (idx >= 0) {
            arr[idx].status = status
            localStorage.setItem('mock_products', JSON.stringify(arr))
          }
        }
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">{product.title}</h1>
        <div className="flex gap-2">
          <Link href={`/product/${product.id}`}>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Ver público</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">Volver</Button>
          </Link>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Estado</span>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="sold">Vendido</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={saveStatus} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>

          <div className="text-gray-300 whitespace-pre-wrap">
            {product.description}
          </div>

          {product.images?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {product.images.map((src, i) => (
                <img key={i} src={src} alt="imagen" className="rounded-lg border border-gray-700 object-cover w-full h-40" />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
