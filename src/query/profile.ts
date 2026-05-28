import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '~/db/profile/profile.functions';
import { queryKeys } from '~/query/queryKeys';

export type ProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>;

export function useGetProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn() {
      return getProfile({ data: {} });
    },
  });
}
