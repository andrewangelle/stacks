import { createMiddleware } from '@tanstack/react-start';
import type { VerifiedNeonUser } from '~/auth/verifyJwt';
import { verifyNeonAuthJwt } from '~/auth/verifyJwt';
import { prisma } from '~/db/prisma';
import { data } from '~/utils/response';

export async function requireAuthenticatedUser(
  request: Request,
): Promise<{ uid: string } | Response> {
  const token = bearerToken(request);
  if (!token) {
    return data({ message: 'Unauthorized' }, 401);
  }

  try {
    const claims = await verifyNeonAuthJwt(token);
    await upsertUserAndProfileToDB(claims);
    return { uid: claims.id };
  } catch {
    return data({ message: 'Unauthorized' }, 401);
  }
}

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const auth = await requireAuthenticatedUser(request);

    if (auth instanceof Response) {
      return next();
    }

    return next({
      context: {
        uid: auth.uid,
      },
    });
  },
);

async function upsertUserAndProfileToDB(
  claims: VerifiedNeonUser,
): Promise<void> {
  const email = claims.email ?? `user-${claims.id}@local.invalid`;
  const trimmed = claims.name?.trim() ?? '';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

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

function bearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}
