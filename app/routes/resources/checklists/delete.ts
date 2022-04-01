import client from '~/modules/supabase';

const responseOptions = {
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const action = async ({ request }: {request: Request}) => {
  switch(request.method){
    case 'DELETE':
      const userData = await request.json()
      const { data, ...rest } = await client(userData.token)
        .from('checklists')
        .delete()
        .match({ id: userData.id })
       
      console.log({
        data,
        rest
      })
      const responseData = {code: 'checklists:delete:success', message: 'success', data};
      return new Response(JSON.stringify(responseData), responseOptions)
  }
}