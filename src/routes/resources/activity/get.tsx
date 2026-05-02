import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/get')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data } = await client()
          .from('activity')
          .select()
          .match({ cardId: userData.cardId });
        return jsonResponse(data);
      },
    },
  },
});
