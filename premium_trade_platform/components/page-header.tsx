"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  User, 
  Settings, 
  Package, 
  Heart,
  Bell,
  ArrowLeft,
  Plus
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  actions?: React.ReactNode
}

export function PageHeader({ title, description, showBackButton = false, actions }: PageHeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigationButtons = [
    {
      href: '/marketplace',
      label: 'Marketplace',
      icon: ShoppingCart,
      active: pathname === '/marketplace'
    },
    {
      href: '/account',
      label: 'Account',
      icon: User,
      active: pathname === '/account'
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      active: pathname === '/settings'
    }
  ]

  // Only show page header buttons when authenticated and on specific pages
  const showPageNavigation = user && ['/marketplace', '/account', '/settings'].includes(pathname)

  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Page Navigation Buttons - Only when authenticated */}
            {showPageNavigation && (
              <div className="flex items-center gap-2">
                {navigationButtons.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`relative group px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        item.active 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </div>
                      
                      {item.active && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20 rounded-lg blur-lg"
                          animate={{
                            opacity: [0, 0.5, 0],
                            scale: [0.9, 1.1, 0.9],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* Quick Actions */}
            {user && (
              <div className="flex items-center gap-2">
                {pathname === '/marketplace' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/sell')}
                    className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                )}
                
                {pathname === '/account' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/favorites')}
                    className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                )}
              </div>
            )}

            {/* Custom Actions */}
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}
