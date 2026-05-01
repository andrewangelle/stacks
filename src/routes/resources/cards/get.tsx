import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  const table = await client().from('cards');
  const { listId } = await request.json();
  const lists = table.data?.filter(
    (value) => `${value.listId}` === `${listId}`,
  );
  return jsonResponse(lists);
};

export const Route = createFileRoute('/resources/cards/get')({
  server: {
    handlers: {
      GET: ({ request }) => action({ request }),
      POST: ({ request }) => action({ request }),
      PUT: ({ request }) => action({ request }),
      PATCH: ({ request }) => action({ request }),
      DELETE: ({ request }) => action({ request }),
    },
  },
  component: () => null,
});
