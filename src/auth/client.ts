import {
  createInternalNeonAuth,
  type ReactBetterAuthClient,
} from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL as string;

const neon = createInternalNeonAuth(authUrl, {
  adapter: BetterAuthReactAdapter(),
});

/** Better Auth client with React hooks (`useSession`, etc.). */
export const authClient = neon.adapter as unknown as ReactBetterAuthClient;

/** JWT bearer for `/resources/*` calls (verified server-side with Neon JWKS). */
export const getJWTToken = neon.getJWTToken;
