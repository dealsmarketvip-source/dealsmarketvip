import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/hooks/use-auth-instant"
import { Navigation } from "@/components/navigation"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ClientErrorHandler from './client-error-handler'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Deals Market - Where Verified Companies Trade Excellence",
  description: "Exclusive B2B marketplace connecting verified companies in Europe and the Middle East for premium deals",
  other: {
    'permissions-policy': 'clipboard-read=*, clipboard-write=*'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientErrorHandler />
        <AuthProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Cargando...</div></div>}>
            <Navigation />
            {children}
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
