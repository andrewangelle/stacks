import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({request}: {request: Request}) => {
  const {userId} = await request.json();
  const {data} = await client()
    .from('profiles')
    .select()
    .match({userId})

  const user = data === null ? {} : data[0];

  return new Response(JSON.stringify(user), responseOptions)
}
