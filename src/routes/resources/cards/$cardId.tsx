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

      console.log(userData);

      const { data, error } = await client(userData.token)
        .from('cards')
        .update([
          {
            cardDescription: userData.cardDescription,
          },
        ])
        .match({ id: params.cardId });

      console.log({ data, error });

      return jsonResponse(data ?? []);
    }

    case 'DELETE': {
      const userData = await request.json();
      const { data: cardData } = await client(userData.token)
        .from('cards')
        .delete()
        .match({ id: userData.id });

      const { data: checklistData } = await client(userData.token)
        .from('checklists')
        .delete()
        .match({ cardId: userData.id });

      const { data: checklistItemData } = await client(userData.token)
        .from('checklist-items')
        .delete()
        .match({ cardId: userData.id });

      console.log({
        cardData,
        checklistData,
        checklistItemData,
      });
      const responseData = {
        code: 'cards:delete:success',
        message: 'success',
        cardData,
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

export const loader = async ({
  params,
}: {
  params: Record<string, string>;
}) => {
  const rows = await client().from('cards').select();

  if (rows.data !== null) {
    const card = rows.data.find((value) => `${value.id}` === params.cardId);
    return jsonResponse(card);
  }

  return jsonResponse({});
};

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    handlers: {
      GET: ({ params }: { params: Record<string, string> }) =>
        loader({ params }),
      POST: ({ request, params }) => action({ request, params }),
      PUT: ({ request, params }) => action({ request, params }),
      PATCH: ({ request, params }) => action({ request, params }),
      DELETE: ({ request, params }) => action({ request, params }),
    },
  },
  component: () => null,
});
