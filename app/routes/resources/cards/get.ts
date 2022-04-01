import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({request}: {request: Request}) => {
  const table = await client().from('cards')
  const {listId} = await request.json();
  const lists = table.data?.filter(value => `${value.listId}` === `${listId}`);
  return new Response(JSON.stringify(lists), responseOptions)
}
