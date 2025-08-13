import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Edge runtime sampling
  tracesSampleRate: 0.05,
  
  // Minimal integrations for edge runtime
  integrations: [],
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Filter sensitive information
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }
    return event;
  },
  
  // Tag for edge runtime
  initialScope: {
    tags: {
      component: 'edge',
    },
  },
});
