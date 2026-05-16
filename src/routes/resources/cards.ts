import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateCreateCardRequestMiddleware } from '~/middleware/cards';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ request, context }) {
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

        POST: {
          middleware: [validateCreateCardRequestMiddleware],
          async handler({ context }) {
            const list = await prisma.list.findFirst({
              where: { id: context.listId, board: { userId: context.uid } },
            });

            if (!list) {
              return data(
                { message: 'Forbidden' },
                { status: 403, statusText: 'Forbidden' },
              );
            }

            const row = await prisma.card.create({
              data: {
                cardTitle: context.cardTitle,
                listId: context.listId,
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
      });
    },
  },
});
