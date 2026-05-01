import { createFileRoute } from '@tanstack/react-router';

import supabase from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  const { email, password, firstName, lastName } = await request.json();

  const { user, error } = await supabase().auth.signUp({
    email: email,
    password: password,
  });

  await supabase()
    .from('profiles')
    .insert([
      {
        userId: user?.id,
        email: user?.email,
        firstName,
        lastName,
      },
    ]);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const Route = createFileRoute('/resources/register')({
  server: {
    handlers: {
      GET: ({ request }) => action({ request }),
      POST: ({ request }) => action({ request }),
      PUT: ({ request }) => action({ request }),
      PATCH: ({ request }) => action({ request }),
      DELETE: ({ request }) => action({ request }),
    },
  },
  component: () => null,
});
