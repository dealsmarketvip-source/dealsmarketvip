"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Store, ShoppingBag, Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth/auth-modal"
import { WelcomePanel } from "@/components/WelcomePanel"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navigation() {
  const { user, userProfile, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showWelcomePanel, setShowWelcomePanel] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleJoinClick = () => {
    if (user) {
      router.push('/marketplace')
    } else {
      setShowWelcomePanel(true)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navItems = [
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/analytics", label: "Analytics", icon: ShoppingBag },
    { href: "/profile", label: "Profile", icon: User }
  ]

  return (
    <>
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 text-primary">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground gradient-text">DEALSMARKET</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Store className="h-3 w-3 text-primary" />
                WHERE VERIFIED COMPANIES TRADE EXCELLENCE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}

            {!user && (
              <Button onClick={handleJoinClick} className="gradient-primary">
                <Crown className="mr-2 h-4 w-4" />
                Join Now
                <ShoppingBag className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 border-t border-border/50"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {user && (
                <>
                  {navItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start text-muted-foreground hover:text-primary"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              )}

              {!user && (
                <Button
                onClick={() => {
                  handleJoinClick()
                  setMobileMenuOpen(false)
                }}
                className="gradient-primary"
              >
                <Crown className="mr-2 h-4 w-4" />
                Join Now
                <ShoppingBag className="ml-2 h-4 w-4" />
              </Button>
              )}
            </div>
          </motion.div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />

      <WelcomePanel
        isOpen={showWelcomePanel}
        onClose={() => setShowWelcomePanel(false)}
      />
    </>
  )
}
