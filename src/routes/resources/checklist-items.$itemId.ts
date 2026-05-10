import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUserFromTokenOnly } from '~/utils/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUserFromTokenOnly(userData.token);

        if (auth instanceof Response) {
          return auth;
        }

        await prisma.checklistItem.updateMany({
          where: {
            id: params.itemId,
            userId: auth.uid,
          },
          data: {
            label: userData.label,
            isCompleted: userData.isCompleted,
          },
        });

        const rows = await prisma.checklistItem.findMany({
          where: { id: params.itemId },
        });

        return jsonResponse(rows);
      },

      async DELETE({ request, params }) {
        const userData = await request.json();
        const auth = await requireMutationUserFromTokenOnly(userData.token);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.checklistItem.findFirst({
          where: {
            id: params.itemId,
            userId: auth.uid,
          },
        });

        if (!row) {
          return jsonResponse({ message: 'Not found' }, 404);
        }

        await prisma.checklistItem.delete({
          where: { id: row.id },
        });

        return jsonResponse({
          code: 'checklists:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
