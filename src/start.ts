import { clerkMiddleware } from '@clerk/tanstack-react-start/server';
import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react';
import { createCsrfMiddleware, createStart } from '@tanstack/react-start';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    sentryGlobalRequestMiddleware,
    clerkMiddleware(),
    csrfMiddleware,
  ],
  functionMiddleware: [sentryGlobalFunctionMiddleware],
}));
