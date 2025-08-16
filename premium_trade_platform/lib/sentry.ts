// Sentry configuration for DealsMarket production monitoring
import * as Sentry from "@sentry/nextjs"

// Initialize Sentry for production monitoring
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Performance monitoring
      tracesSampleRate: 0.1,
      
      // Error filtering
      beforeSend(event) {
        // Filter out common non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.type === 'ChunkLoadError' || 
              error?.value?.includes('Loading chunk') ||
              error?.value?.includes('Loading CSS chunk')) {
            return null
          }
        }
        return event
      },
      
      // Additional context
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ["localhost", "dealsmarket.netlify.app"],
        }),
      ],
    })
  }
}

// Custom error tracking for DealsMarket
export const trackError = (error: Error, context?: Record<string, any>) => {
  console.error('DealsMarket Error:', error)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        component: 'dealsmarket',
        ...context
      }
    })
  }
}

// Track user actions for analytics
export const trackUserAction = (action: string, data?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message: action,
      data,
      level: 'info',
      category: 'user-action'
    })
  }
}

// Performance monitoring
export const trackPerformance = (name: string, duration: number) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message: `Performance: ${name}`,
      data: { duration },
      level: 'info',
      category: 'performance'
    })
  }
}

export default Sentry
