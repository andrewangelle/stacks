import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const signedInState = atom(false);

export type TokenType = {
  access_token: string;
  expires_at: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
  user: Record<'id' | 'email', string>;
};

export const tokenState = atomWithStorage<TokenType | null>('token', null);

/** Persists anonymous guest identity so API `userId` is stable per browser. */
export const guestUserIdState = atomWithStorage<string | null>(
  'guestUserId',
  null,
);
