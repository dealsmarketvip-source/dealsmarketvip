'use client'

import { useEffect } from 'react'

export default function ErrorSuppression() {
  useEffect(() => {
    // Suppress console errors for known development issues
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.error = (...args) => {
      const message = args.join(' ')
      
      // Suppress clipboard API errors
      if (message.includes('Clipboard API has been blocked') ||
          message.includes('NotAllowedError') ||
          message.includes('writeText')) {
        return
      }
      
      // Suppress HMR errors
      if (message.includes('Failed to fetch') ||
          message.includes('chunk') ||
          message.includes('Loading chunk')) {
        return
      }
      
      // Suppress hydration warnings in development
      if (message.includes('Hydration failed') ||
          message.includes('Text content does not match') ||
          message.includes('server rendered HTML')) {
        return
      }
      
      // Call original console.error for other errors
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args.join(' ')
      
      // Suppress clipboard warnings
      if (message.includes('Clipboard API') ||
          message.includes('clipboard')) {
        return
      }
      
      // Call original console.warn for other warnings
      originalConsoleWarn.apply(console, args)
    }

    // Cleanup function
    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }, [])

  return null
}
