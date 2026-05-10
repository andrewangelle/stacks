import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    handlers: {
      async GET({ request }) {
        const listId = new URL(request.url).searchParams.get('listId');
        if (!listId) {
          return jsonResponse([]);
        }

        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const rows = await prisma.card.findMany({
          where: {
            listId,
            list: { board: { userId: auth.uid } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(rows);
      },

      async POST({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const listId =
          typeof userData.listId === 'string' ? userData.listId : '';
        const cardTitle =
          typeof userData.cardTitle === 'string' ? userData.cardTitle : '';

        const list = await prisma.list.findFirst({
          where: { id: listId, board: { userId: auth.uid } },
        });
        if (!list) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.card.create({
          data: {
            cardTitle,
            listId,
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
