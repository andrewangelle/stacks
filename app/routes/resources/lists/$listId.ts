import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
  },
};

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

      return data;
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

      return new Response(JSON.stringify(responseData), responseOptions);
    }
  }
};
