import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/middleware';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/profiles')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ context }) {
        const profile = await prisma.profile.findUnique({
          where: { userId: context.uid },
        });

        if (!profile) {
          return data({ message: 'Not found' }, 404);
        }

        return data({
          id: profile.id,
          createdAt: profile.createdAt.toISOString(),
          email: profile.email ?? '',
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
        });
      },
    },
  },
});
