import { useAuth } from '@clerk/tanstack-react-start';
import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type ProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>;

export function useGetProfileQuery() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    enabled: !!userId,
    queryFn: () =>
      resourceRequest<ProfileType>('profiles', {
        method: 'GET',
      }),
  });
}
