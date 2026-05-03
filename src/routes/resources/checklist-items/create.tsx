import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const action = async ({ request }: { request: Request }) => {
  switch (request.method) {
    case 'POST': {
    }
  }
};

export const Route = createFileRoute('/resources/checklist-items/create')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data, ...rest } = await client(userData.token)
          .from('checklist-items')
          .insert([
            {
              label: userData.label,
              cardId: userData.cardId,
              checklistId: userData.checklistId,
              listId: userData.listId,
              userId: userData.userId,
              isCompleted: false,
            },
          ]);

        console.log({
          data,
          rest,
        });
        const responseData = {
          code: 'checklist-item:create:success',
          message: 'success',
          data,
        };
        return jsonResponse(responseData);
      },
    },
  },
});
