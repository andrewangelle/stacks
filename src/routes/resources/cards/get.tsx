// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { action } from '~/routes/resources/cards/get';

export const Route = createFileRoute('/resources/cards/get')({
  server: {
    handlers: {
      GET: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      POST: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      PUT: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      PATCH: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
      DELETE: ({ request, params }: { request: Request; params: Record<string, string> }) => action({ request, params }),
    },
  },
  component: () => null,
});
