import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists/$checklistId')({
  server: {
    handlers: {
      async DELETE({ request, params }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.checklist.findFirst({
          where: {
            id: params.checklistId,
            userId: auth.uid,
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
