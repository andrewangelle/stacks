import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards')({
  server: {
    handlers: {
      async GET({ request }) {
        const table = client().from('cards').select();
        const searchParams = new URLSearchParams(request.url);
        const listId = searchParams.get('listId');
        const lists = table.data?.filter(
          (value) => `${value.listId}` === `${listId}`,
        );
        return jsonResponse(lists);
      },

      async POST({ request }) {
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
      },
    },
  },
});
