import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { readJsonBody } from '~/utils/readJsonBody';
import { requireAuthenticatedUser } from '~/utils/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity')({
  server: {
    handlers: {
      async GET({ request }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const data = await prisma.activity.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: auth.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await readJsonBody(request);
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
          where: { id: boardId, userId: auth.uid },
        });
        if (!board) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.activity.create({
          data: {
            listId,
            cardId,
            boardId,
            userId: auth.uid,
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
