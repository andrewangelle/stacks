import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import {
  validateDeleteCardRequestMiddleware,
  validateUpdateCardRequestMiddleware,
} from '~/middleware/cards';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    middleware: [authResourceRouteMiddleware],
    handlers({ createHandlers }) {
      return createHandlers({
        async GET({ params, context }) {
          const card = await prisma.card.findFirst({
            where: {
              id: params.cardId,
              list: { board: { userId: context.uid } },
            },
          });

          return data(card ?? {});
        },

        PUT: {
          middleware: [validateUpdateCardRequestMiddleware],
          async handler({ params, context }) {
            const patch: { cardDescription?: string; cardTitle?: string } = {};
            if (context.cardDescription) {
              patch.cardDescription = context.cardDescription;
            }
            if (context.cardTitle) {
              patch.cardTitle = context.cardTitle;
            }

            await prisma.card.updateMany({
              where: {
                id: params.cardId,
                userId: context.uid,
              },
              data: patch,
            });

            const rows = await prisma.card.findMany({
              where: { id: params.cardId },
            });

            return data(rows);
          },
        },

        DELETE: {
          middleware: [validateDeleteCardRequestMiddleware],
          async handler({ context }) {
            const row = await prisma.card.findFirst({
              where: {
                id: context.id,
                userId: context.uid,
              },
            });

            if (!row) {
              return data(
                { message: 'Card Not found' },
                { status: 404, statusText: 'Not found' },
              );
            }

            await prisma.card.delete({
              where: { id: row.id },
            });

            return data({
              code: 'cards:delete:success',
              message: 'success',
              cardData: [row],
            });
          },
        },
      });
    },
  },
});
