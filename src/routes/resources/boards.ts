import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireAuthenticatedUser } from '~/utils/requireUser';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards')({
  server: {
    handlers: {
      async GET({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const data = await prisma.stack.findMany({
          where: { userId: auth.uid },
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
        const boardTitle =
          typeof userData.boardTitle === 'string' ? userData.boardTitle : '';
        const boardColor =
          typeof userData.boardColor === 'string' ? userData.boardColor : '';

        const row = await prisma.stack.create({
          data: {
            boardTitle,
            boardColor,
            userId: auth.uid,
          },
        });

        return jsonResponse({
          code: 'stacks:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
