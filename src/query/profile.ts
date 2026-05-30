import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '~/db/profile/profile.functions';

export type ProfileType = Omit<Profile, 'createdAt' | 'updatedAt'>;

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn() {
      return getProfile();
    },
  });
}
