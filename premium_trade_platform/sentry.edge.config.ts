import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  debug: false,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Skip in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
