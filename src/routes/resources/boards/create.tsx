import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/boards/create')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data } = await client(userData.token)
          .from('stacks')
          .insert([
            {
              boardTitle: userData.boardTitle,
              boardColor: userData.boardColor,
              userId: userData.userId,
            },
          ]);

        const responseData = {
          code: 'stacks:create:success',
          message: 'success',
          data,
        };
        return jsonResponse(responseData);
      },
    },
  },
});
