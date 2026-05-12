import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type ProfileType = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
};

type ProfileArgs = {
  userId: string;
};

export function useGetProfileQuery(
  args: ProfileArgs,
  options?: { skip?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.profile(args.userId),
    enabled: !options?.skip && !!args.userId,
    queryFn: () =>
      resourceRequest<ProfileType>('profiles', {
        method: 'GET',
      }),
  });
}
