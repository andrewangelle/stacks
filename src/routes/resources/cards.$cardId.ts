import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    handlers: {
      async GET({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const card = await prisma.card.findFirst({
          where: {
            id: params.cardId,
            list: { board: { userId: auth.uid } },
          },
        });

        return jsonResponse(card ?? {});
      },

      async PUT({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
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
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const id = typeof userData.id === 'string' ? userData.id : '';

        const row = await prisma.card.findFirst({
          where: {
            id,
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
