import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/modules/response';

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();

        const { data } = await client(userData.token)
          .from('lists')
          .update([
            {
              listTitle: userData.listTitle,
            },
          ])
          .match({ id: params.listId });

        return jsonResponse(data ?? []);
      },

      async DELETE({ request }) {
        const userData = await request.json();
        const id = { id: userData.id };
        const listId = { listId: userData.id };

        const { data } = await client(userData.token)
          .from('lists')
          .delete()
          .match(id);

        await client(userData.token).from('cards').delete().match(listId);

        await client(userData.token).from('checklists').delete().match(listId);

        await client(userData.token)
          .from('checklist-items')
          .delete()
          .match(listId);

        const responseData = {
          code: 'lists:delete:success',
          message: 'success',
          data,
        };

        return jsonResponse(responseData);
      },
    },
  },
  component: () => null,
});
