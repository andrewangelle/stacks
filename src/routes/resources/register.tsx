import { Prisma } from '@prisma/client';
import { createFileRoute } from '@tanstack/react-router';
import bcrypt from 'bcryptjs';
import { prisma } from '~/db/prisma';
import { buildSession } from '~/server/auth';

export const Route = createFileRoute('/resources/register')({
  server: {
    handlers: {
      async POST({ request }) {
        const { email, password, firstName, lastName } = await request.json();

        try {
          const passwordHash = await bcrypt.hash(password, 10);

          const user = await prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
              data: {
                email,
                password: passwordHash,
              },
            });

            await tx.profile.create({
              data: {
                userId: created.id,
                email: created.email,
                firstName,
                lastName,
              },
            });

            return created;
          });

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
        } catch (error: unknown) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            return new Response(
              JSON.stringify({ message: 'Email already registered' }),
              {
                status: 409,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );
          }

          throw error;
        }
      },
    },
  },
});
