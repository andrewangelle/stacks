import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const board = await prisma.stack.findUnique({
          where: { id: params.boardId },
        });

        return jsonResponse(board ?? {});
      },
    },
  },
});
