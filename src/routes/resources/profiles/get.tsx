import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  const { userId } = await request.json();
  const { data } = await client().from('profiles').select().match({ userId });

  const user = data === null ? {} : data[0];

  return jsonResponse(user);
};

export const Route = createFileRoute('/resources/profiles/get')({
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
