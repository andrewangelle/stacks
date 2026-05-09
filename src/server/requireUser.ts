import { prisma } from '~/db/prisma';
import { parseLocalAccessToken } from '~/server/auth';
import { jsonResponse } from '~/utils/response';

async function resolveTokenUser(token: unknown): Promise<string | null> {
  const uid = parseLocalAccessToken(token);
  if (!uid) {
    return null;
  }

  const exists = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true },
  });

  return exists ? uid : null;
}

export async function requireMutationUser(
  token: unknown,
  bodyUserId: unknown,
): Promise<{ uid: string } | Response> {
  if (typeof bodyUserId !== 'string') {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  const uid = await resolveTokenUser(token);

  if (!uid || uid !== bodyUserId) {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  return { uid };
}

export async function requireMutationUserFromTokenOnly(
  token: unknown,
): Promise<{ uid: string } | Response> {
  const uid = await resolveTokenUser(token);

  if (!uid) {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  return { uid };
}
