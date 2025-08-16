'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error for debugging, but handle null/undefined gracefully
    if (error && error.message) {
      console.error('Global error caught:', {
        message: error.message,
        stack: error.stack,
        digest: error.digest
      })
    } else if (error === null || error === undefined) {
      console.warn('Global error handler received null/undefined error')
    } else {
      console.error('Global error handler received non-standard error:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
