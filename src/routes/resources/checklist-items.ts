import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/ensurePersistedUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items')({
  server: {
    handlers: {
      async GET({ request }) {
        const checklistId = new URL(request.url).searchParams.get(
          'checklistId',
        );
        if (!checklistId) {
          return jsonResponse([]);
        }

        const data = await prisma.checklistItem.findMany({
          where: { checklistId },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const userData = await request.json();
        const auth = await requireMutationUser(userData.token, userData.userId);

        if (auth instanceof Response) {
          return auth;
        }

        const row = await prisma.checklistItem.create({
          data: {
            label: userData.label,
            cardId: userData.cardId,
            checklistId: userData.checklistId,
            listId: userData.listId,
            userId: auth.uid,
            isCompleted: false,
          },
        });

        return jsonResponse({
          code: 'checklist-item:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
