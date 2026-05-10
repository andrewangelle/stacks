import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);

        const patch: { label?: string; isCompleted?: boolean } = {};
        if (typeof userData.label === 'string') {
          patch.label = userData.label;
        }
        if (typeof userData.isCompleted === 'boolean') {
          patch.isCompleted = userData.isCompleted;
        }

        await prisma.checklistItem.updateMany({
          where: {
            id: params.itemId,
            userId: auth.uid,
          },
          data: patch,
        });

        const rows = await prisma.checklistItem.findMany({
          where: { id: params.itemId },
        });

        return jsonResponse(rows);
      },

      async DELETE({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
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
