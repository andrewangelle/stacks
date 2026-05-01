import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: Record<string, string>;
}) => {
  switch (request.method) {
    case 'PUT': {
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
    }

    case 'DELETE': {
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
    }
    default: {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
};

export const Route = createFileRoute('/resources/lists/$listId')({
  server: {
    handlers: {
      GET: ({ request, params }) => action({ request, params }),
      POST: ({ request, params }) => action({ request, params }),
      PUT: ({ request, params }) => action({ request, params }),
      PATCH: ({ request, params }) => action({ request, params }),
      DELETE: ({ request, params }) => action({ request, params }),
    },
  },
  component: () => null,
});
