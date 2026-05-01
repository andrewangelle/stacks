import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

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
