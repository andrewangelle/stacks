import {
  auth,
  clerkClient,
  type User,
} from '@clerk/tanstack-react-start/server';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export async function requireAuthenticatedUser(
  _request: Request,
): Promise<{ uid: string } | Response> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return data({ message: 'Unauthorized' }, 401);
  }

  try {
    const user = await clerkClient().users.getUser(userId);
    await upsertUserAndProfileToDB(user);
    return { uid: user.id };
  } catch {
    return data({ message: 'Unauthorized' }, 401);
  }
}

async function upsertUserAndProfileToDB(claims: User): Promise<void> {
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
