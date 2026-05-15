import type { User } from '@clerk/tanstack-react-start/server';
import { prisma } from '~/db/prisma';

export async function upsertUserAndProfileToDB(claims: User): Promise<void> {
  const email =
    claims.emailAddresses[0].emailAddress ?? `user-${claims.id}@local.invalid`;
  const firstName = claims.firstName ?? null;
  const lastName = claims.lastName ?? null;

  await prisma.user.upsert({
    where: { id: claims.id },
    create: { id: claims.id, email },
    update: { email },
  });

  await prisma.profile.upsert({
    where: { userId: claims.id },
    create: {
      userId: claims.id,
      email,
      firstName,
      lastName,
    },
    update: {
      email,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
    },
  });
}
