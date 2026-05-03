import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/cards/$cardId')({
  server: {
    handlers: {
      async GET({ params }) {
        const rows = await client().from('cards').select();

        if (rows.data !== null) {
          const card = rows.data.find(
            (value) => `${value.id}` === params.cardId,
          );
          return jsonResponse(card);
        }

        return jsonResponse({});
      },

      async PUT({ request, params }) {
        const userData = await request.json();

        const { data, error } = await client(userData.token)
          .from('cards')
          .update([
            {
              cardDescription: userData.cardDescription,
            },
          ])
          .match({ id: params.cardId });

        if (error) {
          return jsonResponse(error, 500);
        }

        return jsonResponse(data ?? []);
      },

      async DELETE({ request }) {
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
      },
    },
  },
});
