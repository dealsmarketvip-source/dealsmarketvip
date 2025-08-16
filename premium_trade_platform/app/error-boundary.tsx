'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Only log actual errors, not null/undefined
    if (error && error.message) {
      console.error('Application error:', {
        message: error.message,
        stack: error.stack,
        digest: error.digest
      })

      // Handle specific fetch errors
      if (error.message.includes('Failed to fetch')) {
        console.warn('HMR fetch error detected, this is usually non-critical in development')
      }
    } else if (error === null || error === undefined) {
      console.warn('Null or undefined error caught by error boundary - likely a React development issue')
    } else {
      console.error('Non-standard error object:', error)
    }
  }, [error])

  // Don't render anything for fetch errors in development
  if (error.message.includes('Failed to fetch') && process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message.includes('Failed to fetch') 
            ? 'Connection issue detected. The page should still work normally.'
            : error.message
          }
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
