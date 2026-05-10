import { createFileRoute } from '@tanstack/react-router';
import bcrypt from 'bcryptjs';
import { prisma } from '~/db/prisma';
import { buildSession } from '~/utils/auth';

export const Route = createFileRoute('/resources/signin')({
  server: {
    handlers: {
      async POST({ request }) {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return new Response(
            JSON.stringify({ message: 'Invalid email or password' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        }

        return new Response(
          JSON.stringify({
            user: {
              id: user.id,
              email: user.email,
              role: 'authenticated',
            },
            session: buildSession(user),
            error: null,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      },
    },
  },
});
