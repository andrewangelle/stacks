import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        const listId = new URL(request.url).searchParams.get('listId');
        if (!listId) {
          return jsonResponse([]);
        }

        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
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

        const userData = await safeParse(request);
        const listId =
          typeof userData.listId === 'string' ? userData.listId : '';
        const cardTitle =
          typeof userData.cardTitle === 'string' ? userData.cardTitle : '';

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
