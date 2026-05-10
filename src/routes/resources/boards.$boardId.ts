import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const board = await prisma.stack.findFirst({
          where: { id: params.boardId, userId: auth.uid },
        });

        return jsonResponse(board ?? {});
      },
    },
  },
});
