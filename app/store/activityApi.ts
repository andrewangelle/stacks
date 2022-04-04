import { resourcesApi } from "~/store";

export type ActivityType = {
  id: string;
  created_at: string;
  listId: string;
  cardId: string;
  boardId: string;
  content: string;
  type: string;
}

const activityApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({

    getActivity: builder.query<ActivityType[], {
      cardId: string;
    }>({
      query: ({cardId}) => ({
        url: 'activity/get',
        method: 'post',
        body: {cardId}
      })
    }),

    createActivity: builder.mutation<{data: ActivityType[]}, {
      token: string;
      userId: string;
      cardId: string;
      listId: string;
      boardId: string;
      content: string;
      type: string;
    }>({
      query: ({cardId, listId, boardId, content, token, type, userId}) => ({
        url: 'activity/create',
        method: 'post',
        body: {
          cardId,
          listId,
          boardId,
          content,
          token,
          userId,
          type
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          const { data } = await queryFulfilled;
          dispatch(
            activityApi.util.updateQueryData(
              'getActivity', 
              { cardId: parseInt(arg.cardId, 10) as unknown as string }, 
              cache => ([
                ...cache,
                 data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

    updateActivity: builder.mutation<{data: ActivityType[]}, {
      id: string
      token: string;
      cardId: string;
      content: string;
    }>({
      query: ({ content, token, id}) => ({
        url: `activity/${id}`,
        method: 'put',
        body: {
          content,
          token,
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          dispatch(
            activityApi.util.updateQueryData(
              'getActivity', 
              { cardId: parseInt(arg.cardId, 10) as unknown as string }, 
              cache => cache.map(item => {
                if(item.id === arg.id){
                  return {
                    ...item,
                    content: arg.content
                  }
                }
                return item
              })  
            )
          )
        } catch {

        }
      }
    }),

    deleteActivity: builder.mutation<{data: ActivityType[]}, {
      id: string
      token: string;
      cardId: string;
    }>({
      query: ({ token, id}) => ({
        url: `activity/${id}`,
        method: 'delete',
        body: {
          token,
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          dispatch(
            activityApi.util.updateQueryData(
              'getActivity', 
              { cardId: parseInt(arg.cardId, 10) as unknown as string }, 
              cache => cache.filter(item => item.id !== arg.id)
            )
          )
        } catch {

        }
      }
    })    
  })
});

export const {
  useGetActivityQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  util: {
    updateQueryData: updateActivityCache
  }
} = activityApi