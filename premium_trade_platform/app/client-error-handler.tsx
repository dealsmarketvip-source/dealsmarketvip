'use client'

import { useEffect } from 'react'

export default function ClientErrorHandler() {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Failed to fetch')) {
        // Suppress HMR fetch errors
        console.warn('HMR fetch error suppressed:', event.reason.message)
        event.preventDefault()
        return
      }
      
      // Log other errors for debugging
      console.error('Unhandled promise rejection:', event.reason)
    }

    // Global error handler for JS errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Failed to fetch')) {
        // Suppress HMR fetch errors
        console.warn('HMR fetch error suppressed:', event.error.message)
        event.preventDefault()
        return
      }

      if (event.error?.message?.includes('Hydration failed')) {
        // Suppress hydration errors in development
        console.warn('Hydration error suppressed:', event.error.message)
        event.preventDefault()
        return
      }

      // Log other errors for debugging
      console.error('Global error:', event.error)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
