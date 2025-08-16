"use client"

import React, { createContext, useContext } from 'react'
import { usePageTransition } from '@/hooks/use-page-transition'
import { PageLoadingOverlay } from './page-loading-overlay'
import NavigationErrorBoundary from './navigation-error-boundary'

interface PageTransitionContextType {
  isLoading: boolean
  loadingMessage?: string
  targetPath?: string
  router: ReturnType<typeof usePageTransition>['router']
  setCustomLoadingMessage: (message: string) => void
  stopLoading: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

interface PageTransitionProviderProps {
  children: React.ReactNode
  minLoadingTime?: number
  enableTransitions?: boolean
}

export function PageTransitionProvider({ 
  children, 
  minLoadingTime = 800,
  enableTransitions = true 
}: PageTransitionProviderProps) {
  const transition = usePageTransition({
    enableTransitions,
    minLoadingTime,
    loadingMessages: {
      '/login': 'Iniciando sesión...',
      '/membership': 'Cargando planes de membresía...',
      '/marketplace': 'Abriendo marketplace premium...',
      '/account': 'Cargando información de cuenta...',
      '/settings': 'Accediendo a configuración...',
      '/sell': 'Preparando plataforma de ventas...',
      '/profile': 'Cargando perfil de usuario...',
      '/analytics': 'Generando reportes de análisis...',
      '/upload': 'Preparando centro de subidas...',
      '/verification': 'Procesando verificación...',
      '/': 'Regresando a inicio...'
    }
  })

  const contextValue: PageTransitionContextType = {
    isLoading: transition.isLoading,
    loadingMessage: transition.loadingMessage,
    targetPath: transition.targetPath,
    router: transition.router,
    setCustomLoadingMessage: transition.setCustomLoadingMessage,
    stopLoading: transition.stopLoading
  }

  return (
    <NavigationErrorBoundary>
      <PageTransitionContext.Provider value={contextValue}>
        {children}
        <PageLoadingOverlay
          isLoading={transition.isLoading}
          message={transition.loadingMessage}
          type="navigation"
        />
      </PageTransitionContext.Provider>
    </NavigationErrorBoundary>
  )
}

export function usePageTransitionContext() {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error('usePageTransitionContext must be used within a PageTransitionProvider')
  }
  return context
}

// Helper hook for easy navigation with loading
export function useNavigationWithLoading() {
  const { router } = usePageTransitionContext()
  
  return {
    navigateTo: router.push,
    replaceTo: router.replace,
    goBack: router.back,
    goForward: router.forward
  }
}
