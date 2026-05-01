import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  const userData = await request.json();
  const { data } = await client()
    .from('activity')
    .select()
    .match({ cardId: userData.cardId });
  return jsonResponse(data);
};

export const Route = createFileRoute('/resources/activity/get')({
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
