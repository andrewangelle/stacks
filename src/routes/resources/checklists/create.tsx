import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const Route = createFileRoute('/resources/checklists/create')({
  server: {
    handlers: {
      async POST({ request }) {
        const userData = await request.json();
        const { data, ...rest } = await client(userData.token)
          .from('checklists')
          .insert([
            {
              checklistTitle: userData.checklistTitle,
              cardId: userData.cardId,
              userId: userData.userId,
              listId: userData.listId,
            },
          ]);

        console.log({
          data,
          rest,
        });
        const responseData = {
          code: 'checklists:create:success',
          message: 'success',
          data,
        };
        return jsonResponse(responseData);
      },
    },
  },
});
