import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({
  request,
  params
}:{
  request: Request,
  context: any;
  params: any
}) => {
  const userData = await request.json();
  const {data} = await client()
    .from('activity')
    .select()
    .match({ cardId: userData.cardId})
  return new Response(JSON.stringify(data), responseOptions)
}
