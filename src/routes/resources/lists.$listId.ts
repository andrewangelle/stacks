import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async PUT({ request, params, context }) {
        const userData = await request.json();
        const listTitle = userData.listTitle ?? '';

        const updated = await prisma.list.updateMany({
          where: { id: params.listId, userId: context.uid },
          data: {
            listTitle,
          },
        });

        if (updated.count === 0) {
          return data([]);
        }

        const rows = await prisma.list.findMany({
          where: { id: params.listId },
        });

        return data(rows);
      },

      async DELETE({ request, context }) {
        const userData = await request.json();
        const id = userData.id ?? '';

        const row = await prisma.list.findFirst({
          where: {
            id,
            userId: context.uid,
          },
        });

        if (!row) {
          return data({ message: 'Not found' }, 404);
        }

        await prisma.list.delete({
          where: { id: row.id },
        });

        return data({
          code: 'lists:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
