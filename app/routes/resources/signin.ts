import supabase from '~/modules/supabase';

export const action = async ({ request }: {request: Request}) => {
  const { email, password } = await request.json() 

  console.log(email, password)

  let { user, session, error } = await supabase().auth.signIn({
    email: email,
    password: password,
  });

  if(error){
    return new Response(error.message, {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  return new Response(JSON.stringify({user, session}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
