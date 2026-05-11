import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const card = await prisma.card.findFirst({
          where: {
            id: params.cardId,
            list: { board: { userId: context.uid } },
          },
        });

        return jsonResponse(card ?? {});
      },

      async PUT({ request, params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

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

        return jsonResponse(rows);
      },

      async DELETE({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const id = userData.id ?? '';

        const row = await prisma.card.findFirst({
          where: {
            id,
            userId: context.uid,
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
