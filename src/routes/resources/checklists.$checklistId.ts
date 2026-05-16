import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists/$checklistId')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async DELETE({ params, context }) {
        const row = await prisma.checklist.findFirst({
          where: {
            id: params.checklistId,
            userId: context.uid,
          },
        });

        if (!row) {
          return data(
            { message: 'Checklist Not found' },
            { status: 404, statusText: 'Not found' },
          );
        }

        await prisma.checklist.delete({
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
