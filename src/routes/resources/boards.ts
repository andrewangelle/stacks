import { createFileRoute } from '@tanstack/react-router';
import { authResourceRouteMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/boards')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async GET({ context }) {
        const response = await prisma.stack.findMany({
          where: { userId: context.uid },
          orderBy: { createdAt: 'asc' },
        });

        return data(response);
      },

      async POST({ request, context }) {
        const userData = await request.json();
        const boardTitle = userData.boardTitle ?? '';
        const boardColor = userData.boardColor ?? '';

        const row = await prisma.stack.create({
          data: {
            boardTitle,
            boardColor,
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
  },
});
