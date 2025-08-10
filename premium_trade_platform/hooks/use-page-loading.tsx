"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Cargando...")
  const pathname = usePathname()

  const startLoading = (text = "Cargando...") => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  // Simulate loading for different sections
  const navigateWithLoading = (sectionName: string, callback: () => void) => {
    const loadingTexts: Record<string, string> = {
      marketplace: "Loading Marketplace...",
      membership: "Loading Membership...",
      verification: "Loading Verification...",
      vip: "Loading VIP Zone...",
      default: "Loading content..."
    }

    startLoading(loadingTexts[sectionName] || loadingTexts.default)

    // Instant navigation for production - no artificial delays
    callback()
    stopLoading()
  }

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    navigateWithLoading
  }
}

// Navigation context for global loading state
import { createContext, useContext } from "react"

interface NavigationContextType {
  currentSection: string
  setCurrentSection: (section: string) => void
  isTransitioning: boolean
  setIsTransitioning: (loading: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState("home")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const value = {
    currentSection,
    setCurrentSection,
    isTransitioning,
    setIsTransitioning
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
