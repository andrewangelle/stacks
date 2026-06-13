import type { User } from '@clerk/tanstack-react-start/server';
import { prisma } from '~/db/prisma';

export async function upsertUser(claims: User): Promise<void> {
  const email =
    claims.emailAddresses[0].emailAddress ?? `user-${claims.id}@local.invalid`;

  await prisma.user.upsert({
    where: { id: claims.id },
    create: { id: claims.id, email },
    update: { email },
  });
}
