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
  const userData = await request.json();

  switch (request.method) {
    case 'PUT': {
      const { data, error } = await client(userData.token)
        .from('checklist-items')
        .update([
          {
            label: userData.label,
            isCompleted: userData.isCompleted,
          },
        ])
        .match({ id: params.itemId });

      console.log({ data, error });
      return jsonResponse(data ?? []);
    }

    case 'DELETE': {
      const { data, ...rest } = await client(userData.token)
        .from('checklist-items')
        .delete()
        .match({ id: params.itemId });

      console.log({
        data,
        rest,
      });
      const responseData = {
        code: 'checklists:delete:success',
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

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
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
