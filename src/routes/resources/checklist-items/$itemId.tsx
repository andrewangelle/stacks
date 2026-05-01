import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const Route = createFileRoute('/resources/checklist-items/$itemId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();
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
      },
      async DELETE({ request, params }) {
        const userData = await request.json();
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
      },
    },
  },
});
