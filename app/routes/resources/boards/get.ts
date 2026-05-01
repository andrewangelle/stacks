import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const loader = async ({ request }: { request: Request }) => {
  const userId = request.url.split('get?userId=')[1];
  const { data } = await client().from('stacks').select().match({ userId });
  return new Response(JSON.stringify(data), responseOptions);
};
