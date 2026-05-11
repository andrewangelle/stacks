import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      GET: async ({ params, context }) => {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const board = await prisma.stack.findFirst({
          where: { id: params.boardId, userId: context.uid },
        });

        return jsonResponse(board ?? {});
      },
    },
  },
});
