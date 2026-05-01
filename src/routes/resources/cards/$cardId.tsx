// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { action, loader } from '~/routes/resources/cards/$cardId';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    handlers: {
      GET: ({ request, params }: { request: Request; params: Record<string, string> }) => loader({ request, params }),
      POST: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      PUT: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      PATCH: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      DELETE: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
    },
  },
  component: () => null,
});
