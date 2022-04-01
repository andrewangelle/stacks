import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({
  request,
}:{
  request: Request
}) => {
  switch(request.method){
    case 'POST':
      const userData = await request.json()
      const {data} = await client()
        .from('checklist-items')
        .select()
        .match({
          checklistId: userData.checklistId
        })

      console.log({cardId: userData.cardId, data})
      return new Response(JSON.stringify(data), responseOptions)
  }
}
