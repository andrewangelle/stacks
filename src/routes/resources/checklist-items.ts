import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse, safeParse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ request, context }) {
        const checklistId = new URL(request.url).searchParams.get(
          'checklistId',
        );
        if (!checklistId) {
          return jsonResponse([]);
        }

        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
        }

        const data = await prisma.checklistItem.findMany({
          where: {
            checklistId,
            checklist: {
              card: { list: { board: { userId: context.uid } } },
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        return jsonResponse(data);
      },

      async POST({ request, context }) {
        if (!context?.uid) {
          return jsonResponse({ message: 'Unauthorized' }, 401);
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
            userId: context.uid,
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
            userId: context.uid,
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
