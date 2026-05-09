import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists')({
  server: {
    handlers: {
      async GET({ request }) {
        const boardId = new URL(request.url).searchParams.get('boardId');
        if (!boardId) {
          return jsonResponse([]);
        }

        const lists = await prisma.list.findMany({
          where: { boardId },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(lists);
      },

      async POST({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.list.create({
          data: {
            listTitle: userData.listTitle,
            boardId: userData.boardId,
            userId: auth.uid,
          },
        });

        return jsonResponse({
          code: 'lists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
