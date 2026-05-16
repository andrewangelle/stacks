import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { authResourceRouteMiddleware } from '~/middleware/auth';
import { data } from '~/utils/response';

export const Route = createFileRoute('/resources/profiles')({
  server: {
    middleware: [authResourceRouteMiddleware],

    handlers: {
      async GET({ context }) {
        const profile = await prisma.profile.findUnique({
          where: { userId: context.uid },
        });

        if (!profile) {
          return data(
            { message: 'Profile Not found' },
            { status: 404, statusText: 'Not found' },
          );
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
