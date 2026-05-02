import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/modules/response';

export const Route = createFileRoute('/resources/lists/create')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();

        const { data } = await client(userData.token)
          .from('lists')
          .insert([
            {
              listTitle: userData.listTitle,
              boardId: userData.boardId,
              userId: userData.userId,
            },
          ]);

        const responseData = {
          code: 'lists:create:success',
          message: 'success',
          data,
        };

        return jsonResponse(responseData);
      },
    },
  },
});
