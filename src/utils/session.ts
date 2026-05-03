import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { TokenType } from '~/store/atoms';

export function useTokenFromHash() {
  const { hash } = useLocation();
  return useMemo(() => {
    if (!hash) {
      return null;
    }

    return hash
      .split('&')
      .reduce((acc: Record<string, string>, string: string) => {
        const pairs = string.split('=');
        if (pairs[0] === '#access_token') {
          pairs[0] = pairs[0].split('#')[1];
        }
        acc[pairs[0]] = pairs[1];
        return acc;
      }, {}) as unknown as TokenType;
  }, [hash]);
}

/** Stable id for the auto-created guest session (first visit to `/`). */
export const GUEST_USER_ID = '00000000-0000-4000-8000-000000000001';

export function createGuestToken(): TokenType {
  return {
    access_token: `local-${GUEST_USER_ID}`,
    expires_at: `${Date.now() + 60 * 60 * 1000}`,
    expires_in: '3600',
    refresh_token: `refresh-local-${GUEST_USER_ID}`,
    token_type: 'bearer',
    user: {
      id: GUEST_USER_ID,
      email: 'guest@local',
    },
  };
}
