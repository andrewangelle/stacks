import { ChecklistType, resourcesApi } from "~/store";

export type ChecklistItemType = {
  id: string;
  created_at: string;
  label: string;
  cardId: string;
  listId: string;
  checklistId: string;
  isCompleted: boolean;
  userId: string;
}

const checklistItemsApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({
    getChecklistItems: builder.query<ChecklistItemType[], {checklistId: string;}>({
      query: ({checklistId}) => ({
        url: `checklist-items/get`,
        method: 'POST',
        body: {
          checklistId
        }
      })
    }),

    createChecklistItem: builder.mutation<{data: ChecklistItemType[]}, {
      label: string;
      cardId: string;
      checklistId: string;
      listId: string;
      token: string;
      userId: string;
    }>({
      query: ({ label, cardId, checklistId, listId, token, userId }) => ({
        url: 'checklist-items/create',
        method: 'post',
        body: {
          label, 
          cardId,
          checklistId,
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
            checklistItemsApi.util.updateQueryData(
              'getChecklistItems', 
              { checklistId: arg.checklistId }, 
              cache => ([
                ...cache,
                data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

    updateChecklistItem: builder.mutation<{data: ChecklistItemType[]}, {
      isCompleted: boolean;
      id: string;
      cardId: string;
      checklistId: string;
      label: string;
      token: string;
      userId: string;
    }>({
      query: ({ id, isCompleted, label, token, userId }) => ({
        url: `checklist-items/${id}`,
        method: 'put',
        body: {
          isCompleted, 
          token,
          userId,
          label
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          dispatch(
            checklistItemsApi.util.updateQueryData(
              'getChecklistItems', 
              { checklistId: parseInt(arg.checklistId as string, 10) as unknown as string }, 
              cache => cache.map(item => {
                if(item.id === arg.id){
                  return {
                    ...item,
                    isCompleted: arg.isCompleted,
                    label: arg.label,
                  }
                }
                return item

              }))
          )
        } catch {

        }
      }
    }),

    deleteChecklistItem: builder.mutation<{data: ChecklistType[]}, {
      id: string;
      checklistId: string;
      token: string;
    }>({
      query: ({ token, id }) => ({
        url: `checklist-items/${id}`,
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
            checklistItemsApi.util.updateQueryData(
              'getChecklistItems', 
              { checklistId: parseInt(arg.checklistId as string, 10) as unknown as string }, 
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
  useGetChecklistItemsQuery,
  useCreateChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  util: {
    updateQueryData: updateChecklistItemsCache
  }
} = checklistItemsApi

export const reorderChecklistItems = (item: ChecklistItemType, checklistId: string, droppedId: string) => 
  updateChecklistItemsCache(
    'getChecklistItems', 
    {checklistId}, 
    cache => {
      const cacheArray = [...cache]
      const draggedIndex = cacheArray.findIndex(cacheItem => cacheItem.id === item.id);
      const droppedIndex = cacheArray.findIndex(cacheItem => cacheItem.id === droppedId)
      
      cacheArray.splice(
        droppedIndex,
        0,
        cacheArray.splice(draggedIndex, 1)[0]
      )

      return cacheArray
    }
  )
;