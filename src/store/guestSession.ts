import type { TokenType } from '~/store/atoms';

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
