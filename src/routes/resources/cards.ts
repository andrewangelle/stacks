import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const listId = new URL(request.url).searchParams.get('listId');

        if (!listId) {
          return jsonResponse([]);
        }

        const rows = await prisma.card.findMany({
          where: {
            listId,
            list: { board: { userId: context.uid } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(rows);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const listId = userData.listId ?? '';
        const cardTitle = userData.cardTitle ?? '';

        const list = await prisma.list.findFirst({
          where: { id: listId, board: { userId: context.uid } },
        });

        if (!list) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.card.create({
          data: {
            cardTitle,
            listId,
            userId: context.uid,
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
