import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

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

        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const data = await prisma.checklistItem.findMany({
          where: {
            checklistId,
            checklist: {
              card: { list: { board: { userId: auth.uid } } },
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const userData = await safeParse(request);
        const cardId =
          typeof userData.cardId === 'string' ? userData.cardId : '';
        const checklistId =
          typeof userData.checklistId === 'string' ? userData.checklistId : '';
        const listId =
          typeof userData.listId === 'string' ? userData.listId : '';
        const label = typeof userData.label === 'string' ? userData.label : '';

        const checklist = await prisma.checklist.findFirst({
          where: {
            id: checklistId,
            cardId,
            listId,
            userId: auth.uid,
          },
        });
        if (!checklist) {
          return jsonResponse({ message: 'Forbidden' }, 403);
        }

        const row = await prisma.checklistItem.create({
          data: {
            label,
            cardId,
            checklistId,
            listId,
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
