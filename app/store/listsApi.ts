import { resourcesApi } from "~/store";

export type List = {
  boardId: string;
  id: string;
  listTitle: string;
  userId: string;
}

const listsApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({
    getLists: builder.query<List[], {boardId?: string;}>({
      query: ({ boardId }) => {
        return {
          url: 'lists/get',
          method: 'post',
          body: {boardId}
        }
      },
    }),

    updateList: builder.mutation<void, { 
      boardId: string;
      listId: string;
      listTitle: string, 
      token: string,
      userId: string
    }>({
      query: ({ listId, listTitle, token, userId }) => ({
        url: `lists/${listId}`,
        method: 'put',
        body: {
          listTitle,
          token,
          userId
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          dispatch(
            listsApi.util.updateQueryData(
              'getLists', 
              { boardId: `${arg.boardId}` }, 
              cache => {
                return cache.map(item => {
                  if(item.id === arg.listId){
                    return {
                      ...item,
                      listTitle: arg.listTitle
                    }
                  }
                  return item
                })
              }
            )
          )
        } catch {

        }
      }
    }),

    createList: builder.mutation<{data: List[]}, { 
      listTitle: string; 
      boardId: string;
      token: string;
      userId: string;
    }>({
      query: args => ({
        url: 'lists/create',
        method: 'post',
        body: args
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          const {data} = await queryFulfilled;

          dispatch(
            listsApi.util.updateQueryData(
              'getLists', 
              { boardId: `${arg.boardId}` }, 
              cache => ([
                ...cache,
                data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

    deleteList: builder.mutation<{data: List[]}, {
      id: string;
      userId: string;
      boardId: string;
      token: string;
    }>({
      query: ({ token, id , boardId, userId }) => ({
        url: `lists/${id}`,
        method: 'delete',
        body: {
          id,
          boardId,
          token,
          userId,
        }
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
          dispatch(
            listsApi.util.updateQueryData(
              'getLists', 
              { boardId: args.boardId }, 
              cache =>  cache.filter(item => item.id !== args.id)
            )
          )
        } catch {

        }
      }
    }),

  })
})

export const {
  useGetListsQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  util: {
    updateQueryData: updateListsCache
  }
} = listsApi;

export const reorderLists = (item: List, boardId: string, droppedId: string) => 
  updateListsCache(
    'getLists', 
    {boardId: `${boardId}`}, 
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
