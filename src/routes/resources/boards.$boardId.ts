import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateUpdateBoardRequestMiddleware } from '~/middleware/boards';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    middleware: [authResourceRouteMiddleware],
    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ params, context }) {
          const board = await prisma.stack.findFirst({
            where: { id: params.boardId, userId: context.uid },
          });

          return data(board ?? {});
        },

        PUT: {
          middleware: [validateUpdateBoardRequestMiddleware],
          async handler({ params, context }) {
            const row = await prisma.stack.update({
              where: { id: params.boardId, userId: context.uid },
              data: { boardTitle: context.boardTitle },
            });

            return data({
              code: 'boards:update:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
