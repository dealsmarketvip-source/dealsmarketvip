
"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { 
  Menu, 
  X, 
  Building2, 
  User, 
  LogOut, 
  Settings,
  Plus,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user
  const isVerifiedCompany = session?.user?.role === "VERIFIED_COMPANY"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500">
                <Building2 className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Premium<span className="text-yellow-500">Trade</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && isVerifiedCompany && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/marketplace" 
                  className="text-gray-600 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors"
                >
                  Marketplace
                </Link>
                <Link 
                  href="/ads/new" 
                  className="text-gray-600 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post Ad</span>
                </Link>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 transition-colors"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded dark:bg-gray-800" />
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {session?.user?.company?.status && (
                  <Badge 
                    variant={session.user.company.status === "VERIFIED" ? "success" : "warning"}
                    className="hidden sm:inline-flex"
                  >
                    {session.user.company.status}
                  </Badge>
                )}
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {session?.user?.name || session?.user?.email}
                    </span>
                  </Button>
                  
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-900"
                    >
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/apply">Apply Now</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-md p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="py-4 space-y-2">
              {isAuthenticated && isVerifiedCompany ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/marketplace"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/ads/new"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                  >
                    Post Ad
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                  >
                    About
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                  >
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
