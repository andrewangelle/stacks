import { createRemoteJWKSet, jwtVerify } from 'jose';
export type VerifiedNeonUser = {
  id: string;
  email: string;
  name: string;
};

/** Verifies a Bearer JWT from Neon Auth / Better Auth using hosted JWKS. */
export async function verifyNeonAuthJwt(
  token: string,
): Promise<VerifiedNeonUser> {
  const { payload } = await jwtVerify<VerifiedNeonUser>(
    token,
    createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL ?? '')),
  );

  if (!payload.id) {
    throw new Error('JWT missing subject');
  }

  return { id: payload.id, email: payload.email, name: payload.name };
}
