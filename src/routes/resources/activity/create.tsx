import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'POST': {
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
    }
  }
};

export const Route = createFileRoute('/resources/activity/create')({
  server: {
    handlers: {
      GET: ({ request }) => action({ request }),
      POST: ({ request }) => action({ request }),
      PUT: ({ request }) => action({ request }),
      PATCH: ({ request }) => action({ request }),
      DELETE: ({ request }) => action({ request }),
    },
  },
  component: () => null,
});
