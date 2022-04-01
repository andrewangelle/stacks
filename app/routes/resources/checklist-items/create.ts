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
      const { data, ...rest } = await client(userData.token)
        .from('checklist-items')
        .insert([{
          label: userData.label,
          cardId: userData.cardId,
          checklistId: userData.checklistId,
          userId: userData.userId,
          isCompleted: false
        }])
       
      console.log({
        data,
        rest
      })
      const responseData = {code: 'checklist-item:create:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
  }
}