import supabase from '~/modules/supabase';

export const action = async ({ request }: {request: Request}) => {
  const { email, password } = await request.json();

  let { user, error } = await supabase().auth.signUp({
    email: email,
    password: password,
  });

  console.log(error)

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
