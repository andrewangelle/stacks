import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const boardId = new URL(request.url).searchParams.get('boardId');

        if (!boardId) {
          return jsonResponse({ message: 'Bad Request' }, 400);
        }

        const lists = await prisma.list.findMany({
          where: {
            boardId,
            board: { userId: context.uid },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(lists);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const boardId = userData.boardId ?? '';
        const listTitle = userData.listTitle ?? '';

        const board = await prisma.stack.findFirst({
          where: { id: boardId, userId: context.uid },
        });
        if (!board) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.list.create({
          data: {
            listTitle,
            boardId,
            userId: context.uid,
          },
        });

        return jsonResponse({
          code: 'lists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
