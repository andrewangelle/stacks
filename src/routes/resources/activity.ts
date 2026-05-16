import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { validateCreateActivityRequestMiddleware } from '~/middleware/activity';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/activity')({
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

          const response = await prisma.activity.findMany({
            where: {
              cardId,
              card: { list: { board: { userId: context.uid } } },
            },
            orderBy: { createdAt: 'asc' },
          });

          return data(response);
        },

        POST: {
          middleware: [validateCreateActivityRequestMiddleware],
          async handler({ context }) {
            const board = await prisma.stack.findFirst({
              where: { id: context.boardId, userId: context.uid },
            });

            if (!board) {
              return data(
                { message: 'Forbidden' },
                { status: 403, statusText: 'Forbidden' },
              );
            }

            const row = await prisma.activity.create({
              data: {
                listId: context.listId,
                cardId: context.cardId,
                boardId: context.boardId,
                userId: context.uid,
                content: context.content,
                type: context.type,
              },
            });

            return data({
              code: 'activity:create:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
