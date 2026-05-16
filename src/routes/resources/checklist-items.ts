import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { validateCreateChecklistItemRequestMiddleware } from '~/middleware/checklist-item';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/checklist-items')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ request, context }) {
          const checklistId = new URL(request.url).searchParams.get(
            'checklistId',
          );

          if (!checklistId) {
            return data({ message: 'Bad Request' }, { status: 400 });
          }

          const response = await prisma.checklistItem.findMany({
            where: {
              checklistId,
              checklist: {
                card: { list: { board: { userId: context.uid } } },
              },
            },
            orderBy: { createdAt: 'asc' },
          });

          return data(response);
        },

        POST: {
          middleware: [validateCreateChecklistItemRequestMiddleware],
          async handler({ context }) {
            const checklist = await prisma.checklist.findFirst({
              where: {
                id: context.checklistId,
                cardId: context.cardId,
                listId: context.listId,
                userId: context.uid,
              },
            });

            if (!checklist) {
              return data(
                { message: 'Forbidden' },
                { status: 403, statusText: 'Forbidden' },
              );
            }

            const row = await prisma.checklistItem.create({
              data: {
                label: context.label,
                cardId: context.cardId,
                checklistId: context.checklistId,
                listId: context.listId,
                userId: context.uid,
                isCompleted: false,
              },
            });

            return data({
              code: 'checklist-item:create:success',
              message: 'success',
              data: [row],
            });
          },
        },
      });
    },
  },
});
