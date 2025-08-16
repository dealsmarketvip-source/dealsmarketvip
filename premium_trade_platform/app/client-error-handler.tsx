'use client'

import { useEffect } from 'react'
import '@/lib/clipboard-utils' // Import clipboard fallback

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

      if (event.reason?.message?.includes('Hydration failed')) {
        // Suppress hydration errors in development
        console.warn('Hydration error suppressed:', event.reason.message)
        event.preventDefault()
        return
      }

      if (event.reason?.message?.includes('Clipboard API has been blocked') ||
          event.reason?.name === 'NotAllowedError') {
        // Suppress clipboard errors from dev overlay
        console.warn('Clipboard error suppressed (dev overlay):', event.reason.message)
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

      if (event.error?.message?.includes('Clipboard API has been blocked') ||
          event.error?.name === 'NotAllowedError') {
        // Suppress clipboard errors from dev overlay
        console.warn('Clipboard error suppressed (dev overlay):', event.error.message)
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
