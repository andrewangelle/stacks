import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const Route = createFileRoute('/resources/activity/get')({
  server: {
    handlers: {
      async GET({ request }) {
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
