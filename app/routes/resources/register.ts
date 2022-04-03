import supabase from '~/modules/supabase';

export const action = async ({ request }: {request: Request}) => {
  const { email, password, firstName, lastName } = await request.json();

  let { user, error } = await supabase().auth.signUp({
    email: email,
    password: password,
  });

  await supabase().from('profiles').insert([{
    userId: user?.id,
    email: user?.email,
    firstName,
    lastName
  }])

  if(error){
    return new Response(JSON.stringify({message: error.message}), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return new Response(JSON.stringify({user}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
