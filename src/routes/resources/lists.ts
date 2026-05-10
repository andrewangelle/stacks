import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists')({
  server: {
    handlers: {
      async GET({ request }) {
        const boardId = new URL(request.url).searchParams.get('boardId');
        if (!boardId) {
          return jsonResponse([]);
        }

        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const lists = await prisma.list.findMany({
          where: {
            boardId,
            board: { userId: auth.uid },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(lists);
      },

      async POST({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const boardId =
          typeof userData.boardId === 'string' ? userData.boardId : '';
        const listTitle =
          typeof userData.listTitle === 'string' ? userData.listTitle : '';

        const board = await prisma.stack.findFirst({
          where: { id: boardId, userId: auth.uid },
        });
        if (!board) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.list.create({
          data: {
            listTitle,
            boardId,
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
