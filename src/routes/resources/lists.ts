import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateCreateListRequestMiddleware } from '~/middleware/lists';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/lists')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ request, context }) {
          const boardId = new URL(request.url).searchParams.get('boardId');

          if (!boardId) {
            return data(
              { message: 'Bad Request' },
              { status: 400, statusText: 'Bad Request' },
            );
          }

          const lists = await prisma.list.findMany({
            where: {
              boardId,
              board: { userId: context.uid },
            },
            orderBy: { createdAt: 'asc' },
          });

          return data(lists);
        },

        POST: {
          middleware: [validateCreateListRequestMiddleware],
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

            const row = await prisma.list.create({
              data: {
                listTitle: context.listTitle,
                boardId: context.boardId,
                userId: context.uid,
              },
            });

            return data({
              code: 'lists:create:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
