import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateUpdateChecklistItemRequestMiddleware } from '~/middleware/checklist-item';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ params, context }) {
          const row = await prisma.checklistItem.findFirst({
            where: { id: params.itemId, userId: context.uid },
          });
          return data(row ?? {});
        },
        PUT: {
          middleware: [validateUpdateChecklistItemRequestMiddleware],

          async handler({ params, context }) {
            const patch: { label?: string; isCompleted?: boolean } = {};

            if (typeof context.label === 'string') {
              patch.label = context.label;
            }

            if (typeof context.isCompleted === 'boolean') {
              patch.isCompleted = context.isCompleted;
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
        },

        async DELETE({ params, context }) {
          const row = await prisma.checklistItem.findFirst({
            where: {
              id: params.itemId,
              userId: context.uid,
            },
          });

          if (!row) {
            return data(
              {
                code: 'checklists:delete:error',
                message: 'Checklist Item Not found',
              },
              { status: 404, statusText: 'Not found' },
            );
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
      });
    },
  },
});
