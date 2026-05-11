import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const data = await prisma.activity.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: context.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await safeParse(request);
        const listId =
          typeof userData.listId === 'string' ? userData.listId : '';
        const cardId =
          typeof userData.cardId === 'string' ? userData.cardId : '';
        const boardId =
          typeof userData.boardId === 'string' ? userData.boardId : '';
        const content =
          typeof userData.content === 'string' ? userData.content : '';
        const type = typeof userData.type === 'string' ? userData.type : '';

        const board = await prisma.stack.findFirst({
          where: { id: boardId, userId: context.uid },
        });
        if (!board) {
          return jsonResponse({ message: 'Forbidden' }, 403);
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

        return jsonResponse({
          code: 'activity:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
