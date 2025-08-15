"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UsePageTransitionOptions {
  enableTransitions?: boolean
  minLoadingTime?: number
  loadingMessages?: Record<string, string>
}

export function usePageTransition(options: UsePageTransitionOptions = {}) {
  const {
    enableTransitions = true,
    minLoadingTime = 800,
    loadingMessages = {}
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string>()
  const [targetPath, setTargetPath] = useState<string>()
  
  const router = useRouter()
  const pathname = usePathname()
  const loadingStartTime = useRef<number>()
  const navigationTimeoutRef = useRef<NodeJS.Timeout>()

  // Default loading messages
  const defaultMessages: Record<string, string> = {
    '/login': 'Preparando acceso...',
    '/membership': 'Cargando membresías...',
    '/marketplace': 'Abriendo marketplace...',
    '/account': 'Cargando perfil...',
    '/settings': 'Accediendo a configuración...',
    '/sell': 'Preparando venta...',
    '/profile': 'Cargando información...',
    '/analytics': 'Generando análisis...',
    '/upload': 'Preparando subida...',
    '/verification': 'Verificando datos...',
    ...loadingMessages
  }

  // Get loading message for path
  const getLoadingMessage = (path: string): string => {
    // Check exact matches first
    if (defaultMessages[path]) {
      return defaultMessages[path]
    }

    // Check for partial matches
    const pathSegments = path.split('/').filter(Boolean)
    for (const segment of pathSegments) {
      const matchingKey = Object.keys(defaultMessages).find(key => 
        key.includes(segment) || segment.includes(key.replace('/', ''))
      )
      if (matchingKey) {
        return defaultMessages[matchingKey]
      }
    }

    // Default message
    return 'Navegando...'
  }

  // Navigate with loading overlay
  const navigateWithLoading = async (path: string, options?: { replace?: boolean }) => {
    if (!enableTransitions) {
      if (options?.replace) {
        router.replace(path)
      } else {
        router.push(path)
      }
      return
    }

    // Don't show loading for same page
    if (path === pathname) return

    // Set loading state
    setIsLoading(true)
    setTargetPath(path)
    setLoadingMessage(getLoadingMessage(path))
    loadingStartTime.current = Date.now()

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    // Navigate after a small delay to show the loading screen
    navigationTimeoutRef.current = setTimeout(async () => {
      try {
        if (options?.replace) {
          router.replace(path)
        } else {
          router.push(path)
        }

        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - (loadingStartTime.current || 0)
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

        if (remainingTime > 0) {
          setTimeout(() => {
            setIsLoading(false)
            setTargetPath(undefined)
            setLoadingMessage(undefined)
          }, remainingTime)
        } else {
          setIsLoading(false)
          setTargetPath(undefined)
          setLoadingMessage(undefined)
        }
      } catch (error: any) {
        // Handle different types of navigation errors
        const errorMessage = error?.message || ''

        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('RSC payload')) {
          // For HMR/RSC errors, fall back to window.location
          console.debug('Router error detected, falling back to window.location:', errorMessage)
          window.location.href = path
        } else {
          console.error('Navigation error:', error)
        }

        setIsLoading(false)
        setTargetPath(undefined)
        setLoadingMessage(undefined)
      }
    }, 100)
  }

  // Hide loading when pathname changes (for browser back/forward buttons)
  useEffect(() => {
    if (isLoading && pathname !== targetPath) {
      const elapsedTime = Date.now() - (loadingStartTime.current || 0)
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      if (remainingTime > 0) {
        setTimeout(() => {
          setIsLoading(false)
          setTargetPath(undefined)
          setLoadingMessage(undefined)
        }, remainingTime)
      } else {
        setIsLoading(false)
        setTargetPath(undefined)
        setLoadingMessage(undefined)
      }
    }
  }, [pathname, isLoading, targetPath, minLoadingTime])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  // Create enhanced navigation functions
  const enhancedRouter = {
    push: (path: string) => navigateWithLoading(path),
    replace: (path: string) => navigateWithLoading(path, { replace: true }),
    back: () => {
      setIsLoading(true)
      setLoadingMessage('Regresando...')
      router.back()
      setTimeout(() => setIsLoading(false), minLoadingTime)
    },
    forward: () => {
      setIsLoading(true)
      setLoadingMessage('Avanzando...')
      router.forward()
      setTimeout(() => setIsLoading(false), minLoadingTime)
    }
  }

  return {
    isLoading,
    loadingMessage,
    targetPath,
    router: enhancedRouter,
    setCustomLoadingMessage: setLoadingMessage,
    stopLoading: () => {
      setIsLoading(false)
      setTargetPath(undefined)
      setLoadingMessage(undefined)
    }
  }
}

// Helper function to create navigation links with loading
export function createLoadingLink(href: string, router: ReturnType<typeof usePageTransition>['router']) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }
}
