import { resourcesApi } from "~/store";

export type ProfileType = {
  id: string;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string
}

const profileApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({

    getProfile: builder.query<ProfileType, {
      userId: string;
    }>({
      query: ({userId}) => ({
        url: 'profiles/get',
        method: 'post',
        body: {userId}
      })
    }),
  })
});

export const {
  useGetProfileQuery,
  util: {
    updateQueryData: updateProfileCache
  }
} = profileApi