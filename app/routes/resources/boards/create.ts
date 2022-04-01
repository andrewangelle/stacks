import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({ request }: {request: Request}) => {
  switch(request.method){
    case 'POST':
      const userData = await request.json()
      const { data } = await client(userData.token)
        .from('stacks')
        .insert([{
          boardTitle: userData.boardTitle,
          boardColor: userData.boardColor,
          userId: userData.userId
        }])
        
      const responseData = {code: 'stacks:create:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
  }
}