import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateCreateBoardRequestMiddleware } from '~/middleware/boards';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/boards')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ context }) {
          const response = await prisma.stack.findMany({
            where: { userId: context.uid },
            orderBy: { createdAt: 'asc' },
          });

          return data(response);
        },

        POST: {
          middleware: [validateCreateBoardRequestMiddleware],
          async handler({ context }) {
            const row = await prisma.stack.create({
              data: {
                boardTitle: context.boardTitle,
                boardColor: context.boardColor,
                userId: context.uid,
              },
            });

            return data({
              code: 'stacks:create:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
