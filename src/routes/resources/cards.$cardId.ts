import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/utils/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    handlers: {
      async GET({ params }) {
        const card = await prisma.card.findUnique({
          where: { id: params.cardId },
        });

        return jsonResponse(card ?? {});
      },

      async PUT({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const patch: { cardDescription?: string; cardTitle?: string } = {};
        if (typeof userData.cardDescription === 'string') {
          patch.cardDescription = userData.cardDescription;
        }
        if (typeof userData.cardTitle === 'string') {
          patch.cardTitle = userData.cardTitle;
        }

        await prisma.card.updateMany({
          where: {
            id: params.cardId,
            userId: auth.uid,
          },
          data: patch,
        });

        const rows = await prisma.card.findMany({
          where: { id: params.cardId },
        });

        return jsonResponse(rows);
      },

      async DELETE({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.card.findFirst({
          where: {
            id: userData.id,
            userId: auth.uid,
          },
        });

        if (!row) {
          return jsonResponse({ message: 'Not found' }, 404);
        }

        await prisma.card.delete({
          where: { id: row.id },
        });

        return jsonResponse({
          code: 'cards:delete:success',
          message: 'success',
          cardData: [row],
        });
      },
    },
  },
});
