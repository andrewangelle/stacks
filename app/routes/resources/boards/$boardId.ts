import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const loader = async ({
  params,
}: {
  params: Record<string, string>;
}) => {
  const rows = await client().from('stacks').select();

  if (rows.data !== null) {
    const board = rows.data.find((value) => `${value.id}` === params.boardId);
    return new Response(JSON.stringify(board), responseOptions);
  }

  return new Response(JSON.stringify({}), responseOptions);
};
