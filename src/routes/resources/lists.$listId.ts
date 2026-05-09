import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const updated = await prisma.list.updateMany({
          where: { id: params.listId, userId: auth.uid },
          data: {
            listTitle: userData.listTitle,
          },
        });

        if (updated.count === 0) {
          return jsonResponse([]);
        }

        const rows = await prisma.list.findMany({
          where: { id: params.listId },
        });

        return jsonResponse(rows);
      },

      async DELETE({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.list.findFirst({
          where: {
            id: userData.id,
            userId: auth.uid,
          },
        });

        if (!row) {
          return jsonResponse({ message: 'Not found' }, 404);
        }

        await prisma.list.delete({
          where: { id: row.id },
        });

        return jsonResponse({
          code: 'lists:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
