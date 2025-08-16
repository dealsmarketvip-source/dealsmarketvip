import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="space-y-4">
          <Button asChild>
            <Link href="/">
              Volver al inicio
            </Link>
          </Button>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                Marketplace
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vip">
                Membresía VIP
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
