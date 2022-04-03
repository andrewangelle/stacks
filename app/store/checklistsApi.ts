import { resourcesApi } from ".";


export type ChecklistType = {
  id: string;
  created_at: string;
  checklistTitle: string;
  cardId: string;
  userId: string;
  listId: string;
}


const checklistApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({



    getChecklists: builder.query<ChecklistType[], {cardId: string;}>({
      query: ({cardId}) => ({
        url: `checklists/get`,
        method: 'POST',
        body: {
          cardId
        }
      })
    }),

    createChecklist: builder.mutation<{data: ChecklistType[]}, {
      checklistTitle: string;
      cardId: string;
      listId: string;
      token: string;
      userId: string;
    }>({
      query: ({ listId, checklistTitle, cardId, token, userId }) => ({
        url: 'checklists/create',
        method: 'post',
        body: {
          checklistTitle, 
          cardId,
          listId,
          token,
          userId
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          const { data } = await queryFulfilled;
          dispatch(
            checklistApi.util.updateQueryData(
              'getChecklists', 
              { cardId: arg.cardId }, 
              cache => ([
                ...cache,
                data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

    deleteChecklist: builder.mutation<{data: ChecklistType[]}, {
      id: string;
      cardId: string;
      token: string;
    }>({
      query: ({ token, id }) => ({
        url: 'checklists/delete',
        method: 'delete',
        body: {
          id,
          token,
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          dispatch(
            checklistApi.util.updateQueryData(
              'getChecklists', 
              { cardId: parseInt(arg.cardId as string, 10) as any }, 
              cache =>  cache.filter(item => item.id !== arg.id)
              
            )
          )
        } catch {

        }
      }
    }),
  })
})

export const {
  useGetChecklistsQuery,
  useCreateChecklistMutation,
  useDeleteChecklistMutation,
  util: {
    updateQueryData: updateChecklistsCache
  }
} = checklistApi;