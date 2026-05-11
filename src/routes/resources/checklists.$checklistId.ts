import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists/$checklistId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async DELETE({ params, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const row = await prisma.checklist.findFirst({
          where: {
            id: params.checklistId,
            userId: context.uid,
          },
        });

        if (!row) {
          return jsonResponse({ message: 'Not found' }, 404);
        }

        await prisma.checklist.delete({
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
