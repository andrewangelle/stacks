import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const content =
          typeof userData.content === 'string' ? userData.content : '';

        await prisma.activity.updateMany({
          where: {
            id: params.activityId,
            userId: auth.uid,
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

      async DELETE({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.activity.findFirst({
          where: {
            id: params.activityId,
            userId: auth.uid,
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
