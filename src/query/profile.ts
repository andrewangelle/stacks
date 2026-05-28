import { useAuth } from '@clerk/tanstack-react-start';
import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '~/db/profile';
import { queryKeys } from '~/query/queryKeys';

export type ProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>;

export function useGetProfileQuery() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    enabled: !!userId,
    queryFn: () => getProfile({ data: { userId: userId ?? '' } }),
  });
}
