import { createRemoteJWKSet, type JWTPayload, jwtVerify } from 'jose';
import { neonAuthBaseUrl } from '~/auth/neonAuthBaseUrl';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    const base = neonAuthBaseUrl();
    jwks = createRemoteJWKSet(new URL('jwt', `${base}/`));
  }
  return jwks;
}

export type VerifiedNeonUser = {
  userId: string;
  email?: string;
  name?: string;
};

function extractUserId(payload: JWTPayload): string | null {
  if (typeof payload.sub === 'string' && payload.sub.length > 0) {
    return payload.sub;
  }
  const rec = payload as Record<string, unknown>;
  for (const key of ['userId', 'user_id', 'id']) {
    const v = rec[key];
    if (typeof v === 'string' && v.length > 0) {
      return v;
    }
  }
  return null;
}

/** Verifies a Bearer JWT from Neon Auth / Better Auth using hosted JWKS. */
export async function verifyNeonAuthJwt(
  token: string,
): Promise<VerifiedNeonUser> {
  const { payload } = await jwtVerify(token, getJwks(), {
    clockTolerance: 60,
  });

  const userId = extractUserId(payload);
  if (!userId) {
    throw new Error('JWT missing subject');
  }

  const rec = payload as Record<string, unknown>;
  const email = typeof rec.email === 'string' ? rec.email : undefined;
  const name = typeof rec.name === 'string' ? rec.name : undefined;

  return { userId, email, name };
}
