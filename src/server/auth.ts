export type SessionPayload = {
  access_token: string;
  expires_at: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
  user: { id: string; email: string };
};

/** Matches the prior local-auth session shape (`local-<userId>` tokens). */
export function buildSession(user: {
  id: string;
  email: string;
}): SessionPayload {
  return {
    access_token: `local-${user.id}`,
    expires_at: `${Date.now() + 60 * 60 * 1000}`,
    expires_in: '3600',
    refresh_token: `refresh-local-${user.id}`,
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
