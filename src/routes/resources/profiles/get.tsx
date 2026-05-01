import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const Route = createFileRoute('/resources/profiles/get')({
  server: {
    handlers: {
      async GET({ request }) {
        const { userId } = await request.json();
        const { data } = await client()
          .from('profiles')
          .select()
          .match({ userId });

        const user = data === null ? {} : data[0];

        return jsonResponse(user);
      },
    },
  },
});
