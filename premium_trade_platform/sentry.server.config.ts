// This file configures the initialization of Sentry on the server
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Configure error filtering for server
  beforeSend(event, hint) {
    // Add server-specific context
    if (event.tags) {
      event.tags.runtime = 'server';
    } else {
      event.tags = { runtime: 'server' };
    }
    
    // Filter out database connection errors in development
    if (process.env.NODE_ENV === 'development' && 
        event.exception?.values?.some(v => 
          v.value?.includes('ECONNREFUSED') ||
          v.value?.includes('Database not configured')
        )) {
      return null;
    }
    
    return event;
  },
  
  // Set server-specific context
  initialScope: {
    tags: {
      component: 'dealsmarket-server',
      runtime: 'nodejs',
      environment: process.env.NODE_ENV,
    },
  },
  
  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Configure release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  
  // Server-specific integrations
  integrations: [
    // Add server-specific integrations here
  ],
});
