import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { AppError } from '~/components/AppError';
import { NotFound } from '~/components/NotFound';
import { queryClient } from '~/queryClient';
import { initSentry } from '~/sentry.config';
import { boardIDMask, cardMask } from '~/utils/routeMasks';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: AppError,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    routeMasks: [boardIDMask, cardMask],
    context: {
      queryClient,
    },
    defaultPreloadStaleTime: 0,
  });

  if (!router.isServer) {
    initSentry(router);
  }

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
