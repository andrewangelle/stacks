import type { VerifiedNeonUser } from '~/auth/verifyJwt';
import { prisma } from '~/db/prisma';

/** Upserts `User` + `Profile` rows keyed by Neon Auth user id (greenfield). */
export async function ensureAppUser(claims: VerifiedNeonUser): Promise<void> {
  const { id: userId, email: tokenEmail, name } = claims;
  const email =
    tokenEmail && tokenEmail.length > 0
      ? tokenEmail
      : `user-${userId}@local.invalid`;

  const trimmed = name?.trim() ?? '';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email },
    update: { email },
  });

  await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
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
