import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export async function getProfileQuery(data: WithUserId<object>) {
  const profile = await prisma.profile.findUnique({
    where: { userId: data.userId },
  });

  if (!profile) {
    throw new Error('Profile Not found');
  }

  return {
    id: profile.id,
    createdAt: profile.createdAt.toISOString(),
    email: profile.email ?? '',
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
  };
}
