import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists/$checklistId')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async DELETE({ params, context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const row = await prisma.checklist.findFirst({
          where: {
            id: params.checklistId,
            userId: context.uid,
          },
        });

        if (!row) {
          return data({ message: 'Not found' }, 404);
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
