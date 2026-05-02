import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/modules/response';

export const Route = createFileRoute('/resources/activity/create')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data } = await client(userData.token)
          .from('activity')
          .insert([
            {
              listId: userData.listId,
              cardId: userData.cardId,
              boardId: userData.boardId,
              userId: userData.userId,
              content: userData.content,
              type: userData.type,
            },
          ]);

        const responseData = {
          code: 'activity:create:success',
          message: 'success',
          data,
        };
        return jsonResponse(responseData);
      },
    },
  },
});
