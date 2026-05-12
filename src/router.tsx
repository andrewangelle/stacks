import * as Sentry from '@sentry/tanstackstart-react';
import { createRouter } from '@tanstack/react-router';
import { AppError } from '~/components/AppError';
import { NotFound } from '~/components/NotFound';
import { routeTree } from './routeTree.gen';

const sentryDsn =
  import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN;

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: AppError,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
  });

  if (!router.isServer) {
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

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
