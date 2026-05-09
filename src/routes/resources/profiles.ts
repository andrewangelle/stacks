import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '~/db/prisma';
import { jsonResponse } from '~/utils/response';

export const Route = createFileRoute('/resources/profiles')({
  server: {
    handlers: {
      async GET({ request }) {
        const userId = new URL(request.url).searchParams.get('userId');

        if (!userId) {
          return jsonResponse({});
        }

        const profile = await prisma.profile.findUnique({
          where: { userId },
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
