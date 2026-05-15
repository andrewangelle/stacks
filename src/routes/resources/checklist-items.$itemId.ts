import { createFileRoute } from '@tanstack/react-router';
import { authResourceRouteMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async PUT({ request, params, context }) {
        const userData = await request.json();

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
            userId: context.uid,
          },
          data: patch,
        });

        const rows = await prisma.checklistItem.findMany({
          where: { id: params.itemId },
        });

        return data(rows);
      },

      async DELETE({ params, context }) {
        const row = await prisma.checklistItem.findFirst({
          where: {
            id: params.itemId,
            userId: context.uid,
          },
        });

        if (!row) {
          return data({ message: 'Not found' }, 404);
        }

        await prisma.checklistItem.delete({
          where: { id: row.id },
        });

        return data({
          code: 'checklists:delete:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
