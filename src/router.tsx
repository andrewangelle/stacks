import { createRouter } from '@tanstack/react-router';
import { AppError } from '~/components/AppError';
import { NotFound } from '~/components/NotFound';
import { initSentry } from '~/sentry.config';
import { boardIDMask } from '~/utils/routeMasks';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: AppError,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    routeMasks: [boardIDMask],
  });

  if (!router.isServer) {
    initSentry(router);
  }

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
