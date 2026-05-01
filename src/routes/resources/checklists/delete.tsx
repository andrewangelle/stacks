import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'DELETE': {
      const userData = await request.json();
      const { data, ...rest } = await client(userData.token)
        .from('checklists')
        .delete()
        .match({ id: userData.id });

      const { data: itemData } = await client(userData.token)
        .from('checklist-items')
        .delete()
        .match({ checklistId: userData.id });

      console.log({
        data,
        itemData,
        rest,
      });
      const responseData = {
        code: 'checklists:delete:success',
        message: 'success',
        data,
      };
      return jsonResponse(responseData);
    }
  }
};

export const Route = createFileRoute('/resources/checklists/delete')({
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
