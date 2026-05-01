// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { loader } from '~/routes/resources/boards/$boardId';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    handlers: {
      GET: ({ request, params }: { request: Request; params: Record<string, string> }) => loader({ request, params }),
    },
  },
  component: () => null,
});
