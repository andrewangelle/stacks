import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const loader = async ({ request }: { request: Request }) => {
  const userId = request.url.split('get?userId=')[1];
  const { data } = await client().from('stacks').select().match({ userId });
  return jsonResponse(data);
};

export const Route = createFileRoute('/resources/boards/get')({
  server: {
    handlers: {
      GET: ({ request }) => loader({ request }),
    },
  },
  component: () => null,
});
