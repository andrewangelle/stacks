import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/checklists/get')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data } = await client()
          .from('checklists')
          .select()
          .match({ cardId: userData.cardId });

        console.log({ cardId: userData.cardId, data });
        return jsonResponse(data);
      },
    },
  },
});
