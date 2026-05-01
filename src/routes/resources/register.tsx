import { createFileRoute } from '@tanstack/react-router';
import supabase from '~/modules/supabase';

export const Route = createFileRoute('/resources/register')({
  server: {
    handlers: {
      async POST({ request }) {
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
      },
    },
  },
});
