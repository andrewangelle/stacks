import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'POST': {
      const userData = await request.json();
      const { data, ...rest } = await client(userData.token)
        .from('cards')
        .insert([
          {
            cardTitle: userData.cardTitle,
            listId: userData.listId,
            userId: userData.userId,
          },
        ]);

      console.log({
        data,
        rest,
      });
      const responseData = {
        code: 'lists:create:success',
        message: 'success',
        data,
      };
      return jsonResponse(responseData);
    }
  }
};

export const Route = createFileRoute('/resources/cards/create')({
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
