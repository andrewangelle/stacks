import { authClient } from '~/auth/client';

export function useSessionUserId(): string | undefined {
  const { data } = authClient.useSession();
  return data?.user.id;
}
