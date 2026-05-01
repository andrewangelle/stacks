import { createFileRoute } from '@tanstack/react-router';

import supabase from '~/modules/supabase';

export const action = async ({ request }: { request: Request }) => {
  const { email, password } = await request.json();

  const { user, session, error } = await supabase().auth.signIn({
    email: email,
    password: password,
  });

  if (error) {
    return new Response(error.message, {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ user, session }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const Route = createFileRoute('/resources/signin')({
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
