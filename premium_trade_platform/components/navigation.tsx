"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  User, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Package, 
  Heart,
  Bell,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

export function Navigation() {
  const { user, userProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        await signOut()
        toast.success('Sesión cerrada correctamente')
        router.push('/')
      } else {
        throw new Error('Error al cerrar sesión')
      }
    } catch (error) {
      toast.error('Error al cerrar sesión')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navItems = [
    {
      href: '/marketplace',
      label: 'Marketplace',
      icon: ShoppingCart,
      description: 'Explora productos premium',
      requiresAuth: true
    },
    {
      href: '/account',
      label: 'Cuenta',
      icon: User,
      description: 'Gestiona tu perfil',
      requiresAuth: true
    },
    {
      href: '/settings',
      label: 'Ajustes',
      icon: Settings,
      description: 'Configuración de la cuenta',
      requiresAuth: true
    }
  ]

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href
    const canAccess = !item.requiresAuth || user

    const handleClick = () => {
      if (item.requiresAuth && !user) {
        toast.error('Debes iniciar sesión para acceder')
        router.push('/login')
        return
      }
      router.push(item.href)
      setIsMenuOpen(false)
    }

    return (
      <motion.button
        onClick={handleClick}
        className={`relative group px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg' 
            : canAccess
            ? 'text-foreground hover:text-primary hover:bg-primary/10'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? {
          boxShadow: [
            "0 0 20px rgba(245, 158, 11, 0.3)",
            "0 0 40px rgba(245, 158, 11, 0.6)",
            "0 0 20px rgba(245, 158, 11, 0.3)"
          ]
        } : {}}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Glow effect background */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-lg opacity-0"
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        <div className="relative z-10 flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
          {item.requiresAuth && !user && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-4">
              Auth
            </Badge>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {item.description}
          {item.requiresAuth && !user && ' (Requiere login)'}
        </div>
      </motion.button>
    )
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(245, 158, 11, 0.2)",
                  "0 0 30px rgba(245, 158, 11, 0.4)",
                  "0 0 20px rgba(245, 158, 11, 0.2)"
                ]
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Crown className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                DEALSMARKET
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Premium B2B Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation - Always show but disable when not authenticated */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavButton key={item.href} item={item} />
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Sell Button */}
            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/sell">
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg relative overflow-hidden"
                    size="sm"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <Package className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Vender</span>
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>

                {/* User Avatar */}
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={userProfile?.profile_image_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground">
                        {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-foreground">
                        {userProfile?.full_name || 'Usuario'}
                      </p>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1 py-0">
                          Premium
                        </Badge>
                      </div>
                    </div>
                  </motion.div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2 space-y-1">
                      <Link href="/account">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                          <User className="h-4 w-4" />
                          Mi Cuenta
                        </div>
                      </Link>
                      <Link href="/favorites">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                          <Heart className="h-4 w-4" />
                          Favoritos
                        </div>
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <LoadingSpinner size="sm" variant="default" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/membership">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <Sparkles className="mr-2 h-4 w-4" />
                      Unirse
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Only show when authenticated */}
        <AnimatePresence>
          {isMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavButton key={item.href} item={item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
