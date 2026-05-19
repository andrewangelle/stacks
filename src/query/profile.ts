import { useAuth } from '@clerk/tanstack-react-start';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type ProfileType = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
};

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
