"use client"

import { useEffect } from 'react'

/**
 * Global Error Suppressor Component
 * Handles common non-critical errors that appear in development/production
 */
export function GlobalErrorSuppressor() {
  useEffect(() => {
    // Suppress ResizeObserver loop completed errors
    // These are harmless and occur when ResizeObserver callbacks take too long
    const resizeObserverErrorHandler = (event: ErrorEvent) => {
      if (
        event.message &&
        event.message.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        event.preventDefault()
        event.stopPropagation()
        // Optionally log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('Suppressed ResizeObserver loop warning (harmless)')
        }
        return false
      }
    }

    // Suppress unhandled promise rejections for specific known issues
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        typeof event.reason === 'string' &&
        (
          event.reason.includes('Failed to fetch') ||
          event.reason.includes('Load failed') ||
          event.reason.includes('NetworkError')
        )
      ) {
        event.preventDefault()
        if (process.env.NODE_ENV === 'development') {
          console.debug('Suppressed network error promise rejection:', event.reason)
        }
        return false
      }
    }

    // Add global error listeners
    window.addEventListener('error', resizeObserverErrorHandler)
    window.addEventListener('unhandledrejection', unhandledRejectionHandler)

    // Cleanup listeners
    return () => {
      window.removeEventListener('error', resizeObserverErrorHandler)
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler)
    }
  }, [])

  return null // This component doesn't render anything
}
