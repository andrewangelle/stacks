import { createMiddleware } from '@tanstack/react-start';
import { ensureAppUser } from '~/auth/ensureAppUser';
import { verifyNeonAuthJwt } from '~/auth/verifyJwt';
import { jsonResponse } from '~/utils/response';

function bearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

/** Validates Bearer JWT, syncs app user row, returns Neon user id. */
export async function requireAuthenticatedUser(
  request: Request,
): Promise<{ uid: string } | Response> {
  const token = bearerToken(request);
  if (!token) {
    return jsonResponse({ message: 'Unauthorized' }, 401);
  }

  try {
    const claims = await verifyNeonAuthJwt(token);
    await ensureAppUser(claims);
    return { uid: claims.id };
  } catch {
    return jsonResponse({ message: 'Unauthorized' }, 401);
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
