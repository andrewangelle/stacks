import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateCreateChecklistRequestMiddleware } from '~/middleware/checklists';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ request, context }) {
          const cardId = new URL(request.url).searchParams.get('cardId');

          if (!cardId) {
            return data(
              { message: 'Bad Request' },
              { status: 400, statusText: 'Bad Request' },
            );
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

        POST: {
          middleware: [validateCreateChecklistRequestMiddleware],
          async handler({ context }) {
            const card = await prisma.card.findFirst({
              where: {
                id: context.cardId,
                listId: context.listId,
                list: { board: { userId: context.uid } },
              },
            });
            if (!card) {
              return data(
                { message: 'Forbidden' },
                { status: 403, statusText: 'Forbidden' },
              );
            }

            const row = await prisma.checklist.create({
              data: {
                checklistTitle: context.checklistTitle,
                cardId: context.cardId,
                userId: context.uid,
                listId: context.listId,
              },
            });

            return data({
              code: 'checklists:create:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
