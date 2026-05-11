import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const data = await prisma.checklist.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: context.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
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
            list: { board: { userId: context.uid } },
          },
        });
        if (!card) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.checklist.create({
          data: {
            checklistTitle,
            cardId,
            userId: context.uid,
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
