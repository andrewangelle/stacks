import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const listId = new URL(request.url).searchParams.get('listId');

        if (!listId) {
          return data([]);
        }

        const rows = await prisma.card.findMany({
          where: {
            listId,
            list: { board: { userId: context.uid } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return data(rows);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const userData = await request.json();
        const listId = userData.listId ?? '';
        const cardTitle = userData.cardTitle ?? '';

        const list = await prisma.list.findFirst({
          where: { id: listId, board: { userId: context.uid } },
        });

        if (!list) {
          return data({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.card.create({
          data: {
            cardTitle,
            listId,
            userId: context.uid,
          },
        });

        return data({
          code: 'cards:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
