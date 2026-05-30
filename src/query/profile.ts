import { useQuery } from '@tanstack/react-query';
import { getProfile } from '~/db/profile/profile.functions';

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn() {
      return getProfile();
    },
  });
}
