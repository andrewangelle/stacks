import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const data = await prisma.stack.findMany({
          where: { userId: context.uid },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const boardTitle = userData.boardTitle ?? '';
        const boardColor = userData.boardColor ?? '';

        const row = await prisma.stack.create({
          data: {
            boardTitle,
            boardColor,
            userId: context.uid,
          },
        });

        return jsonResponse({
          code: 'stacks:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
