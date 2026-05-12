import * as Sentry from '@sentry/tanstackstart-react'

const sentryDsn = import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN

if (!sentryDsn) {
  console.warn('env var is not defined. Sentry is not running.')
} else {
  Sentry.init({
    dsn: sentryDsn,
    enabled: process.env.NODE_ENV === "production",
    // Adds request headers and IP for users
    sendDefaultPii: true,
    tracesSampleRate: 1.0
  })
}
