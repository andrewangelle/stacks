import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'POST': {
      const userData = await request.json();
      const { data } = await client().from('checklist-items').select().match({
        checklistId: userData.checklistId,
      });

      console.log({ cardId: userData.cardId, data });
      return jsonResponse(data);
    }
  }
};

export const Route = createFileRoute('/resources/checklist-items/get')({
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
