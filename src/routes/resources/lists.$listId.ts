import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import {
  validateDeleteListRequestMiddleware,
  validateUpdateListRequestMiddleware,
} from '~/middleware/lists';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        PUT: {
          middleware: [validateUpdateListRequestMiddleware],
          async handler({ params, context }) {
            const updated = await prisma.list.updateMany({
              where: { id: params.listId, userId: context.uid },
              data: {
                listTitle: context.listTitle,
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
        },

        DELETE: {
          middleware: [validateDeleteListRequestMiddleware],
          async handler({ context }) {
            const row = await prisma.list.findFirst({
              where: {
                id: context.id,
                userId: context.uid,
              },
            });

            if (!row) {
              return data(
                { message: 'List Not found' },
                { status: 404, statusText: 'Not found' },
              );
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
      });
    },
  },
});
