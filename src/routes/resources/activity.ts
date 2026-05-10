import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/utils/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity')({
  server: {
    handlers: {
      async GET({ request }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        const data = await prisma.activity.findMany({
          where: { cardId },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.activity.create({
          data: {
            listId: userData.listId,
            cardId: userData.cardId,
            boardId: userData.boardId,
            userId: auth.uid,
            content: userData.content,
            type: userData.type,
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
