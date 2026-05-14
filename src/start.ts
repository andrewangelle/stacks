import { clerkMiddleware } from '@clerk/tanstack-react-start/server';
import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react';
import { createStart } from '@tanstack/react-start';

export const startInstance = createStart(() => ({
  requestMiddleware: [sentryGlobalRequestMiddleware, clerkMiddleware()],
  functionMiddleware: [sentryGlobalFunctionMiddleware],
}));
