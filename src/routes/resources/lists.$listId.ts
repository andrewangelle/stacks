import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const listTitle =
          typeof userData.listTitle === 'string' ? userData.listTitle : '';

        const updated = await prisma.list.updateMany({
          where: { id: params.listId, userId: auth.uid },
          data: {
            listTitle,
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
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const id = typeof userData.id === 'string' ? userData.id : '';

        const row = await prisma.list.findFirst({
          where: {
            id,
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
