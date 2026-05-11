import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async PUT({ request, params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const userData = await safeParse(request);
        const content =
          typeof userData.content === 'string' ? userData.content : '';

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

        return jsonResponse(rows);
      },

      async DELETE({ params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const row = await prisma.activity.findFirst({
          where: {
            id: params.activityId,
            userId: context.uid,
          },
        });

        if (!row) {
          return jsonResponse({ message: 'Not found' }, 404);
        }

        await prisma.activity.delete({
          where: { id: row.id },
        });

        return jsonResponse({
          code: 'activity:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
