import { createFileRoute } from '@tanstack/react-router';
import { authResourceRouteMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async PUT({ request, params, context }) {
        const userData = await request.json();
        const content = userData.content ?? '';

        await prisma.activity.updateMany({
          where: {
            id: params.activityId,
            userId: context.uid,
          },
          data: {
            content,
          },
        });

        const rows = await prisma.activity.findMany({
          where: { id: params.activityId },
        });

        return data(rows);
      },

      async DELETE({ params, context }) {
        const row = await prisma.activity.findFirst({
          where: {
            id: params.activityId,
            userId: context.uid,
          },
        });

        if (!row) {
          return data({ message: 'Not found' }, 404);
        }

        await prisma.activity.delete({
          where: { id: row.id },
        });

        return data({
          code: 'activity:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
