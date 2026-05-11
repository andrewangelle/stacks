import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async PUT({ request, params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await safeParse(request);
        const listTitle =
          typeof userData.listTitle === 'string' ? userData.listTitle : '';

        const updated = await prisma.list.updateMany({
          where: { id: params.listId, userId: context.uid },
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

      async DELETE({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await safeParse(request);
        const id = typeof userData.id === 'string' ? userData.id : '';

        const row = await prisma.list.findFirst({
          where: {
            id,
            userId: context.uid,
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
