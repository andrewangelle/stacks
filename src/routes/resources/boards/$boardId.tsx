import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const rows = client().from('stacks').select();

        if (rows.data !== null) {
          const board = rows.data.find(
            (value) => `${value.id}` === params.boardId,
          );
          return jsonResponse(board);
        }

        return jsonResponse({});
      },
    },
  },
});
