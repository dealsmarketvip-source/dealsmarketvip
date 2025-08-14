"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  User, 
  Settings, 
  Package, 
  Heart,
  Bell,
  Plus,
  LogOut
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"

export function AuthenticatedNav() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on main page or login pages
  if (!user || ['/', '/login', '/access'].includes(pathname)) {
    return null
  }

  const navigationButtons = [
    {
      href: '/marketplace',
      label: 'Marketplace',
      icon: ShoppingCart,
      active: pathname === '/marketplace',
      description: 'Browse deals'
    },
    {
      href: '/account',
      label: 'Account',
      icon: User,
      active: pathname === '/account',
      description: 'Your profile'
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      active: pathname === '/settings',
      description: 'Preferences'
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border/40 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-primary">DealsMarket</h2>
            <div className="h-6 w-px bg-border"></div>
            <span className="text-sm text-muted-foreground">Welcome back!</span>
          </div>

          {/* Navigation Buttons */}
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
                  title={item.description}
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
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              {pathname === '/marketplace' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/sell')}
                  className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sell</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-500/10 hover:text-red-700"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
