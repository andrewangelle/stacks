import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/profiles')({
  server: {
    middleware: [authMiddleware],

    handlers: {
      async GET({ context }) {
        if (!context?.uid) {
          return data({ message: 'Unauthorized' }, 401);
        }

        const profile = await prisma.profile.findUnique({
          where: { userId: context.uid },
        });

        if (!profile) {
          return data({});
        }

        return data({
          id: profile.id,
          created_at: profile.createdAt.toISOString(),
          email: profile.email ?? '',
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
        });
      },
    },
  },
});
