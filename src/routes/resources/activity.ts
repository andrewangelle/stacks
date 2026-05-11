import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/activity')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const cardId = new URL(request.url).searchParams.get('cardId');

        if (!cardId) {
          return data({ message: 'Bad Request' }, 400);
        }

        const response = await prisma.activity.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: context.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return data(response);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const listId = userData.listId ?? '';
        const cardId = userData.cardId ?? '';
        const boardId = userData.boardId ?? '';
        const content = userData.content ?? '';
        const type = userData.type ?? '';

        const board = await prisma.stack.findFirst({
          where: { id: boardId, userId: context.uid },
        });

        if (!board) {
          return data({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.activity.create({
          data: {
            listId,
            cardId,
            boardId,
            userId: context.uid,
            content,
            type,
          },
        });

        return data({
          code: 'activity:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
