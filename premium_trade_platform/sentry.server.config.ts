import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Server-side sampling
  tracesSampleRate: 0.1,
  
  // Enable server-side session replay
  // Note: This will only capture server-side events
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection(),
  ],
  
  // Performance monitoring
  profilesSampleRate: 0.1,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Filter out sensitive information
  beforeSend(event) {
    // Don't log API keys, passwords, etc.
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }
    
    // Filter out noise
    if (event.exception?.values?.[0]?.value?.includes('Non-Error promise rejection captured')) {
      return null;
    }
    
    return event;
  },
  
  // Don't report errors from these URLs
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'ChunkLoadError',
    'Loading chunk',
    'Network request failed',
  ],
  
  // Tag important context
  initialScope: {
    tags: {
      component: 'server',
    },
  },
});
