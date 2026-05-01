import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'POST': {
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
    }
  }
};

export const Route = createFileRoute('/resources/lists/create')({
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
