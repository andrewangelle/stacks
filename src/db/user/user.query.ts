import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getUserPreferences,
  setCommentsVisible,
} from '~/db/user/user.functions';
import type { SetCommentsVisibleArgs } from '~/db/user/user.schemas';
import { useIsMobile } from '~/hooks/useIsMobile';
import { queryClient } from '~/query';

type UserPreferences = Awaited<ReturnType<typeof getUserPreferences>>;

export const userPreferencesQueryKey = ['user', 'preferences'];

export const userPreferencesQueryOptions = {
  queryKey: userPreferencesQueryKey,
  queryFn() {
    return getUserPreferences();
  },
};

/** Mobile always shows comments, so it never fetches the preference. */
export function useCommentsVisible() {
  const isMobile = useIsMobile();
  const { data } = useQuery({
    ...userPreferencesQueryOptions,
    enabled: !isMobile,
    select(preferences: UserPreferences) {
      return preferences.commentsVisible;
    },
  });

  return isMobile || (data ?? true);
}

export function useSetCommentsVisible() {
  const mutation = useMutation({
    mutationFn(data: SetCommentsVisibleArgs) {
      return setCommentsVisible({ data });
    },

    onMutate(variables) {
      const snapshot = queryClient.getQueryData<UserPreferences>(
        userPreferencesQueryKey,
      );

      queryClient.setQueryData<UserPreferences>(userPreferencesQueryKey, {
        ...snapshot,
        commentsVisible: variables.commentsVisible,
      });

      return { snapshot };
    },

    onError(_error, variables, context) {
      queryClient.setQueryData<UserPreferences>(
        userPreferencesQueryKey,
        context?.snapshot ?? { commentsVisible: !variables.commentsVisible },
      );
    },
  });

  return mutation.mutate;
}
