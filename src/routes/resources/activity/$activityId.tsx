import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/activity/$activityId')({
  server: {
    handlers: {
      async PUT({ request, params }) {
        const userData = await request.json();
        const { data, error } = await client(userData.token)
          .from('activity')
          .update([
            {
              content: userData.content,
            },
          ])
          .match({ id: params.activityId });

        console.log({ data, error });
        return jsonResponse(data ?? []);
      },
      async DELETE({ request, params }) {
        const userData = await request.json();
        const { data, ...rest } = await client(userData.token)
          .from('activity')
          .delete()
          .match({ id: params.activityId });

        console.log({
          data,
          rest,
        });
        const responseData = {
          code: 'activity:delete:success',
          message: 'success',
          data,
        };
        return jsonResponse(responseData);
      },
    },
  },
});
