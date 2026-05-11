import {
  createInternalNeonAuth,
  type ReactBetterAuthClient,
} from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL as string;

const neon = createInternalNeonAuth(authUrl, {
  adapter: BetterAuthReactAdapter(),
});

export const authClient = neon.adapter as unknown as ReactBetterAuthClient;

export const getJWTToken = neon.getJWTToken;
