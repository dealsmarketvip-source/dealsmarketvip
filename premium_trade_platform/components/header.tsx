"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthModal } from "@/components/auth-modal"

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const navItems = [
    { name: "Marketplace", href: "#marketplace" },
    { name: "Servicios", href: "#servicios" },
    { name: "VIP", href: "#vip" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleRegister = () => {
    setAuthMode("register")
    setShowAuthModal(true)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Logo and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-8"
          >
            <div className="flex flex-col items-start">
              <span className="text-foreground text-2xl font-bold tracking-wider gradient-text">BRIDGEZONE</span>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                EL MARKETPLACE BUSCADO
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={`header-desktop-${item.name}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <Button
              onClick={handleRegister}
              className="gradient-primary text-primary-foreground hover:scale-105 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-300 glow-primary"
            >
              Registrarse
            </Button>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/50">
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-semibold text-foreground">Navegación</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={`header-mobile-${item.name}`}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      className="text-muted-foreground hover:text-primary justify-start text-lg py-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}

                  <Button
                    onClick={handleRegister}
                    className="w-full gradient-primary text-primary-foreground px-6 py-2 rounded-full font-medium shadow-lg"
                  >
                    Registrarse
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className={`flex items-center gap-0 rounded-2xl overflow-hidden transition-all duration-300 ${
              isSearchFocused ? "glow-primary-strong" : "shadow-lg"
            }`}
          >
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-card border-0 rounded-none h-14 text-foreground">
                <SelectValue placeholder="Categorías" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="luxury">Artículos de Lujo</SelectItem>
                <SelectItem value="vehicles">Vehículos</SelectItem>
                <SelectItem value="real-estate">Inmuebles</SelectItem>
                <SelectItem value="art">Arte y Coleccionables</SelectItem>
                <SelectItem value="business">Negocios</SelectItem>
                <SelectItem value="services">Servicios</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Input
                placeholder="¿Qué estás buscando?"
                className="border-0 rounded-none h-14 bg-card text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-6 gradient-primary rounded-none hover:scale-105 transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </motion.header>
  )
}
