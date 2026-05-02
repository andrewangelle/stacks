import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/modules/response';

export const Route = createFileRoute('/resources/cards/get')({
  server: {
    handlers: {
      async GET({ request }) {
        const table = await client().from('cards').select();
        const { listId } = await request.json();
        const lists = table.data?.filter(
          (value) => `${value.listId}` === `${listId}`,
        );
        return jsonResponse(lists);
      },
    },
  },
});
