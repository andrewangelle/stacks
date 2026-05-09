import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/ensurePersistedUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards')({
  server: {
    handlers: {
      async GET({ request }) {
        const userId = new URL(request.url).searchParams.get('userId');
        if (!userId) {
          return jsonResponse([]);
        }

        const data = await prisma.stack.findMany({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.stack.create({
          data: {
            boardTitle: userData.boardTitle,
            boardColor: userData.boardColor,
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
