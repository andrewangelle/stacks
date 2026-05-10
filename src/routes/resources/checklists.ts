import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireAuthenticatedUser } from '~/utils/requireUser';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists')({
  server: {
    handlers: {
      async GET({ request }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const data = await prisma.checklist.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: auth.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const cardId =
          typeof userData.cardId === 'string' ? userData.cardId : '';
        const listId =
          typeof userData.listId === 'string' ? userData.listId : '';
        const checklistTitle =
          typeof userData.checklistTitle === 'string'
            ? userData.checklistTitle
            : '';

        const card = await prisma.card.findFirst({
          where: {
            id: cardId,
            listId,
            list: { board: { userId: auth.uid } },
          },
        });
        if (!card) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.checklist.create({
          data: {
            checklistTitle,
            cardId,
            userId: auth.uid,
            listId,
          },
        });

        return jsonResponse({
          code: 'checklists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
