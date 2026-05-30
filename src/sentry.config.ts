import * as Sentry from '@sentry/tanstackstart-react';
import type { getRouter } from '~/router';

const sentryDsn =
  import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN;

export function initSentry(router: ReturnType<typeof getRouter>) {
  Sentry.init({
    dsn: sentryDsn,
    enabled: import.meta.env.PROD,
    sendDefaultPii: true,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.replayIntegration(),
      Sentry.linkedErrorsIntegration(),
      Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
  });
}
