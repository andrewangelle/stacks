import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ params, context }) {
        const card = await prisma.card.findFirst({
          where: {
            id: params.cardId,
            list: { board: { userId: context.uid } },
          },
        });

        return data(card ?? {});
      },

      async PUT({ request, params, context }) {
        const userData = await request.json();
        const patch: { cardDescription?: string; cardTitle?: string } = {};
        if (userData.cardDescription) {
          patch.cardDescription = userData.cardDescription;
        }
        if (userData.cardTitle) {
          patch.cardTitle = userData.cardTitle;
        }

        await prisma.card.updateMany({
          where: {
            id: params.cardId,
            userId: context.uid,
          },
          data: patch,
        });

        const rows = await prisma.card.findMany({
          where: { id: params.cardId },
        });

        return data(rows);
      },

      async DELETE({ request, context }) {
        const userData = await request.json();
        const id = userData.id ?? '';

        const row = await prisma.card.findFirst({
          where: {
            id,
            userId: context.uid,
          },
        });

        if (!row) {
          return data({ message: 'Not found' }, 404);
        }

        await prisma.card.delete({
          where: { id: row.id },
        });

        return data({
          code: 'cards:delete:success',
          message: 'success',
          cardData: [row],
        });
      },
    },
  },
});
