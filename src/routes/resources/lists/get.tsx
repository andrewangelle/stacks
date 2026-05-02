import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/modules/response';

export const Route = createFileRoute('/resources/lists/get')({
  server: {
    handlers: {
      async GET({ request }) {
        const table = await client().from('lists').select();
        const { boardId } = await request.json();
        const lists = table.data?.filter((value) => value.boardId === boardId);
        return jsonResponse(lists);
      },
    },
  },
});
