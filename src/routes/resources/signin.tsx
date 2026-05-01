import { createFileRoute } from '@tanstack/react-router';
import supabase from '~/modules/supabase';

export const Route = createFileRoute('/resources/signin')({
  server: {
    handlers: {
      async POST({ request }) {
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
      },
    },
  },
});
