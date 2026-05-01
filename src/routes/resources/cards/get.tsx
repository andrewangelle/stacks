import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const Route = createFileRoute('/resources/cards/get')({
  server: {
    handlers: {
      async GET({ request }) {
        const table = await client().from('cards');
        const { listId } = await request.json();
        const lists = table.data?.filter(
          (value) => `${value.listId}` === `${listId}`,
        );
        return jsonResponse(lists);
      },
    },
  },
});
