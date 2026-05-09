import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '~/db/prisma';
import { parseLocalAccessToken } from '~/server/auth';
import { jsonResponse } from '~/utils/response';

/**
 * Browser guests use client-generated IDs (`/` route + `createGuestToken`) that never hit
 * register/sign-in. Postgres FKs require a matching `users` row — lazily create a minimal
 * guest user + profile on first mutation (registered users already exist → cheap findUnique).
 */
export async function ensurePersistedUser(userId: string): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(`guest-bootstrap:${userId}`, 10);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        email: `guest.${userId.replace(/-/g, '')}@guest.invalid`,
        password: passwordHash,
        profile: {
          create: {
            firstName: 'Guest',
            lastName: '',
          },
        },
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return;
    }
    throw error;
  }
}

export async function requireMutationUser(
  token: unknown,
  bodyUserId: unknown,
): Promise<{ uid: string } | Response> {
  const uid = parseLocalAccessToken(token);

  if (!uid || typeof bodyUserId !== 'string' || uid !== bodyUserId) {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  await ensurePersistedUser(uid);

  return { uid };
}

export async function requireMutationUserFromTokenOnly(
  token: unknown,
): Promise<{ uid: string } | Response> {
  const uid = parseLocalAccessToken(token);

  if (!uid) {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  await ensurePersistedUser(uid);

  return { uid };
}
