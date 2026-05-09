import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    handlers: {
      async GET({ request }) {
        const listId = new URL(request.url).searchParams.get('listId');
        if (!listId) {
          return jsonResponse([]);
        }

        const rows = await prisma.card.findMany({
          where: { listId },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(rows);
      },

      async POST({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.card.create({
          data: {
            cardTitle: userData.cardTitle,
            listId: userData.listId,
            userId: auth.uid,
          },
        });

        return jsonResponse({
          code: 'cards:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
