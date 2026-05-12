import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/lists')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        const boardId = new URL(request.url).searchParams.get('boardId');

        if (!boardId) {
          return data({ message: 'Bad Request' }, 400);
        }

        const lists = await prisma.list.findMany({
          where: {
            boardId,
            board: { userId: context.uid },
          },
          orderBy: { createdAt: 'asc' },
        });

        return data(lists);
      },

      async POST({ request, context }) {
        const userData = await request.json();
        const boardId = userData.boardId ?? '';
        const listTitle = userData.listTitle ?? '';

        const board = await prisma.stack.findFirst({
          where: { id: boardId, userId: context.uid },
        });
        if (!board) {
          return data({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.list.create({
          data: {
            listTitle,
            boardId,
            userId: context.uid,
          },
        });

        return data({
          code: 'lists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
