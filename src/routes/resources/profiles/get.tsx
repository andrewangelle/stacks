import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

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
