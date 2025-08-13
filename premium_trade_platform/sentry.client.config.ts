// This file configures the initialization of Sentry on the browser
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0, // Only in production
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  
  // Configure error filtering
  beforeSend(event, hint) {
    // Filter out known non-actionable errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Filter React hydration errors in development
      if (process.env.NODE_ENV === 'development' && 
          event.exception.values?.some(v => 
            v.value?.includes('Hydration') || 
            v.value?.includes('Text content did not match')
          )) {
        return null;
      }
      
      // Filter network errors we can't control
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = String(error.message).toLowerCase();
        if (errorMessage.includes('network') || 
            errorMessage.includes('fetch') ||
            errorMessage.includes('cors')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Set additional context
  initialScope: {
    tags: {
      component: 'dealsmarket-web',
      environment: process.env.NODE_ENV,
    },
  },
  
  // Configure integrations
  integrations: [
    new Sentry.Replay({
      // Capture 10% of all sessions in production
      sessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0,
      // Capture 100% of sessions with an error
      errorSampleRate: 1.0,
      // Configure privacy settings
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Configure release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
});
