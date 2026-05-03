import { createFileRoute } from '@tanstack/react-router';
import client from '~/db/client';

export const Route = createFileRoute('/resources/register')({
  server: {
    handlers: {
      async POST({ request }) {
        const { email, password, firstName, lastName } = await request.json();

        const { user, error } = await client().auth.signUp({
          email: email,
          password: password,
        });

        await client()
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
          const err = error as Error;
          return new Response(JSON.stringify({ message: err.message }), {
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
