import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUserFromTokenOnly } from '~/server/ensurePersistedUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUserFromTokenOnly(userData.token);

        if (auth instanceof Response) {
          return auth;
        }

        await prisma.activity.updateMany({
          where: {
            id: params.activityId,
            userId: auth.uid,
          },
          data: {
            content: userData.content,
          },
        });

        const rows = await prisma.activity.findMany({
          where: { id: params.activityId },
        });

        return jsonResponse(rows);
      },

      async DELETE({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUserFromTokenOnly(userData.token);

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
