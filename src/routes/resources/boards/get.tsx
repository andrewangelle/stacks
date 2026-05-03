import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/get')({
  server: {
    handlers: {
      async GET({ request }) {
        const userId = request.url.split('get?userId=')[1];
        const { data } = await client()
          .from('stacks')
          .select()
          .match({ userId });
        return jsonResponse(data);
      },
    },
  },
});
