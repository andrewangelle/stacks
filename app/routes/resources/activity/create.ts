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
        .from('activity')
        .insert([{
          listId: userData.listId,
          cardId: userData.cardId,
          boardId: userData.boardId,
          userId: userData.userId,
          content: userData.content,
          type: userData.type
        }])
        
      const responseData = {code: 'activity:create:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
  }
}