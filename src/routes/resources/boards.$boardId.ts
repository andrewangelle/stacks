import { createFileRoute } from '@tanstack/react-router';
import { authResourceRouteMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      GET: async ({ params, context }) => {
        const board = await prisma.stack.findFirst({
          where: { id: params.boardId, userId: context.uid },
        });

        return data(board ?? {});
      },
    },
  },
});
