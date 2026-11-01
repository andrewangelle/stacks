import type { User } from '@clerk/tanstack-react-start/server';
import { prisma } from '~/db/prisma';
import type { SetCommentsVisibleArgs } from '~/db/user/user.schemas';
import type { WithUserId } from '~/db/withUserId';

export async function upsertUser(claims: User): Promise<void> {
  const email =
    claims.emailAddresses[0].emailAddress ?? `user-${claims.id}@local.invalid`;

  await prisma.user.upsert({
    where: { id: claims.id },
    create: { id: claims.id, email },
    update: { email },
  });
}

export async function isUserPersisted(id: string) {
  return prisma.user.findFirstOrThrow({
    where: { id },
  });
}

export async function getUserPreferencesQuery({ userId }: WithUserId<object>) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { commentsVisible: true },
  });

  return { commentsVisible: user?.commentsVisible ?? true };
}

export async function setCommentsVisibleQuery({
  userId,
  commentsVisible,
}: WithUserId<SetCommentsVisibleArgs>) {
  return prisma.user.update({
    where: { id: userId },
    data: { commentsVisible },
    select: { commentsVisible: true },
  });
}
