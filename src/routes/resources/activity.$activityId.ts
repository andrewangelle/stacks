import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { validateUpdateActivityRequestMiddleware } from '~/middleware/activity';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        PUT: {
          middleware: [validateUpdateActivityRequestMiddleware],
          async handler({ params, context }) {
            await prisma.activity.updateMany({
              where: {
                id: params.activityId,
                userId: context.uid,
              },
              data: {
                content: context.content,
              },
            });

            const rows = await prisma.activity.findMany({
              where: { id: params.activityId },
            });

            return data(rows);
          },
        },

        async DELETE({ params, context }) {
          const row = await prisma.activity.findFirst({
            where: {
              id: params.activityId,
              userId: context.uid,
            },
          });

          if (!row) {
            return data(
              { message: 'Activity Not found' },
              { status: 404, statusText: 'Not found' },
            );
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
      });
    },
  },
});
