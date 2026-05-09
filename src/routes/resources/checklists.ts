import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { requireMutationUser } from '~/server/requireUser';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists')({
  server: {
    handlers: {
      async GET({ request }) {
        const cardId = new URL(request.url).searchParams.get('cardId');
        if (!cardId) {
          return jsonResponse([]);
        }

        const data = await prisma.checklist.findMany({
          where: { cardId },
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

        const row = await prisma.checklist.create({
          data: {
            checklistTitle: userData.checklistTitle,
            cardId: userData.cardId,
            userId: auth.uid,
            listId: userData.listId,
          },
        });

        return jsonResponse({
          code: 'checklists:create:success',
          message: 'success',
          data: [row],
        });
      },
    },
  },
});
