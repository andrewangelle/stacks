import { createFileRoute } from '@tanstack/react-router';
import { authResourceRouteMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async GET({ request, context }) {
        const cardId = new URL(request.url).searchParams.get('cardId');

        if (!cardId) {
          return data({ message: 'Bad Request' }, 400);
        }

        const response = await prisma.checklist.findMany({
          where: {
            cardId,
            card: { list: { board: { userId: context.uid } } },
          },
          orderBy: { createdAt: 'asc' },
        });

        return data(response);
      },

      async POST({ request, context }) {
        const userData = await request.json();
        const cardId = userData.cardId ?? '';
        const listId = userData.listId ?? '';
        const checklistTitle = userData.checklistTitle ?? '';

        const card = await prisma.card.findFirst({
          where: {
            id: cardId,
            listId,
            list: { board: { userId: context.uid } },
          },
        });
        if (!card) {
          return data({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.checklist.create({
          data: {
            checklistTitle,
            cardId,
            userId: context.uid,
            listId,
          },
        });

        return data({
          code: 'checklists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
