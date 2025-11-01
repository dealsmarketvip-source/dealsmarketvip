"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Card } from '@/components/ui/card'

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const tabs = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Usuarios' },
    { href: '/admin/notifications', label: 'Notificaciones' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6 flex items-center gap-4">
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href} className={`px-4 py-2 rounded-md text-sm border ${pathname === tab.href ? 'bg-primary text-primary-foreground border-primary' : 'text-gray-300 border-gray-700 hover:bg-gray-800'}`}>
              {tab.label}
            </Link>
          ))}
        </div>
        <Card className="bg-gray-800 border-gray-700 p-4">
          {children}
        </Card>
      </div>
    </div>
  )
}
