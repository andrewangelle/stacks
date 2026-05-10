import { createFileRoute } from '@tanstack/react-router';
import { requireAuthenticatedUser } from '~/auth/requireUser';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/profiles')({
  server: {
    handlers: {
      async GET({ request }) {
        const auth = await requireAuthenticatedUser(request);
        if (auth instanceof Response) {
          return auth;
        }

        const profile = await prisma.profile.findUnique({
          where: { userId: auth.uid },
        });

        if (!profile) {
          return jsonResponse({});
        }

        return jsonResponse({
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
