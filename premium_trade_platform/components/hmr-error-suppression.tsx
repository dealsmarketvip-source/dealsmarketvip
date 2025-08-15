"use client"

import { useEffect } from 'react'

export default function HMRErrorSuppression() {
  useEffect(() => {
    // Suppress HMR fetch errors in development
    if (process.env.NODE_ENV === 'development') {
      const originalFetch = window.fetch
      const originalConsoleError = console.error
      const originalConsoleWarn = console.warn

      // Override fetch to handle HMR-related failures gracefully
      window.fetch = async (...args) => {
        try {
          return await originalFetch(...args)
        } catch (error) {
          // Check if it's an HMR-related fetch error
          const errorMessage = error?.message || ''
          const isHMRError = 
            errorMessage.includes('Failed to fetch') ||
            errorMessage.includes('RSC payload') ||
            errorMessage.includes('_next/static') ||
            args[0]?.toString().includes('_next/static')

          if (isHMRError) {
            // Silently fail for HMR errors and return a mock response
            console.debug('HMR fetch error suppressed:', errorMessage)
            return new Response('{}', { 
              status: 200, 
              statusText: 'OK',
              headers: { 'content-type': 'application/json' }
            })
          }
          
          // Re-throw non-HMR errors
          throw error
        }
      }

      // Suppress specific console errors related to HMR
      console.error = (...args) => {
        const message = args[0]?.toString() || ''
        
        // List of error patterns to suppress
        const suppressPatterns = [
          'Failed to fetch RSC payload',
          'TypeError: Failed to fetch',
          'Falling back to browser navigation',
          'HMR connection lost',
          'WebSocket connection',
          'Hot reload',
          'chunk load failed',
          'Loading chunk',
          'ChunkLoadError'
        ]

        const shouldSuppress = suppressPatterns.some(pattern => 
          message.includes(pattern)
        )

        if (!shouldSuppress) {
          originalConsoleError(...args)
        } else {
          console.debug('Suppressed HMR error:', message)
        }
      }

      // Suppress specific console warnings related to HMR
      console.warn = (...args) => {
        const message = args[0]?.toString() || ''
        
        const suppressWarningPatterns = [
          'Fast Refresh',
          'Hot reload',
          'HMR',
          'chunk',
          '_next/static'
        ]

        const shouldSuppress = suppressWarningPatterns.some(pattern => 
          message.includes(pattern)
        )

        if (!shouldSuppress) {
          originalConsoleWarn(...args)
        }
      }

      // Handle unhandled promise rejections from HMR
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason?.message || event.reason?.toString() || ''
        
        const isHMRRelated = 
          reason.includes('Failed to fetch') ||
          reason.includes('RSC payload') ||
          reason.includes('_next/static') ||
          reason.includes('chunk')

        if (isHMRRelated) {
          console.debug('Suppressed HMR promise rejection:', reason)
          event.preventDefault()
        }
      }

      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      // Cleanup function
      return () => {
        window.fetch = originalFetch
        console.error = originalConsoleError
        console.warn = originalConsoleWarn
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      }
    }
  }, [])

  return null
}
