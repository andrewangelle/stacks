import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Board = {
  id: string;
  boardColor: string;
  boardTitle: string;
  userId: string;
};

export type List = {
  boardId: string;
  id: string;
  listTitle: string;
  userId: string;
}

export type ListCardType = {
  id: string;
  created_at: string;
  listId: string;
  userId: string;
  cardTitle: string;
  cardDescription: string;
}


export type ChecklistType = {
  id: string;
  created_at: string;
  checklistTitle: string;
  cardId: string;
  userId: string;
  listId: string;
}

export type ChecklistItemType = {
  id: string;
  created_at: string;
  label: string;
  cardId: string;
  checklistId: string;
  isCompleted: boolean;
  userId: string;
}



export const resourcesApi = createApi({
  baseQuery: fetchBaseQuery({baseUrl: '/resources'}),
  reducerPath: 'resources',
  endpoints: builder => ({
    getBoards: builder.query<Board[], string | undefined>({
      query: (userId) => `boards/get?userId=${userId}`
    }),

    getBoard: builder.query<Board, string | undefined>({
      query: (boardId) => `boards/${boardId}`
    }),

    createBoard: builder.mutation<{data: Board[]}, {
      boardTitle: string, 
      boardColor: string,
      token: string,
      userId: string
    }>({
      query: ({
        boardTitle,
        boardColor,
        token,
        userId
      }) => ({
        url: 'boards/create',
        method: 'post',
        body: {
          boardColor,
          boardTitle,
          token,
          userId
        }
      }),

      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          const {data} = await queryFulfilled;
          dispatch(
            resourcesApi.util.updateQueryData(
              'getBoards', 
              arg.userId, 
              cache => ([
                ...cache,
                data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

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
            resourcesApi.util.updateQueryData(
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
            resourcesApi.util.updateQueryData(
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
            resourcesApi.util.updateQueryData(
              'getLists', 
              { boardId: args.boardId }, 
              cache =>  cache.filter(item => item.id !== args.id)
            )
          )
        } catch {

        }
      }
    }),

    getCards: builder.query<ListCardType[], {listId: string;}>({
      query: ({listId}) => ({
        url: 'cards/get',
        method: 'post',
        body: {listId}
      }),
    }),

    createCard: builder.mutation<{data: ListCardType[]}, {
      cardTitle: string;
      listId: string;
      token: string;
      userId: string;
    }>({
      query: ({ cardTitle, listId, token, userId }) => ({
        url: 'cards/create',
        method: 'post',
        body: {
          cardTitle, 
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
            resourcesApi.util.updateQueryData(
              'getCards', 
              { listId: arg.listId }, 
              cache => ([
                ...cache,
                 data.data[0]
              ]))
          )
        } catch {

        }
      }
    }),

    updateCard: builder.mutation<void, {
      listId: string,
      cardId: string,
      cardDescription: string, 
      cardTitle: string,
      token: string,
      userId: string
    }>({
      query: ({ 
        cardId, 
        cardDescription, 
        cardTitle, 
        token, 
        userId 
      }) => ({
        url: `cards/${cardId}`,
        method: 'put',
        body: {
          cardDescription,
          cardTitle,
          token,
          userId
        }
      }),

      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          dispatch(
            resourcesApi.util.updateQueryData(
              'getCards', 
              { listId: arg.listId }, 
              cache => cache.map(item => {
                if(item.id === arg.cardId){
                  return {
                    ...item,
                    cardDescription: arg.cardDescription,
                    cardTitle: arg.cardTitle
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

    deleteCard: builder.mutation<void, {
      id: string,
      listId: string,
      token: string,
      userId: string
    }>({
      query: ({ 
        id, 
        listId,
        token, 
        userId 
      }) => ({
        url: `cards/${id}`,
        method: 'delete',
        body: {
          id,
          token,
          userId
        }
      }),

      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled

          dispatch(
            resourcesApi.util.updateQueryData(
              'getCards', 
              { listId: arg.listId }, 
              cache => cache.filter(item => item.id !== arg.id)
            )
          )
        } catch {

        }
      }
    }),


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
            resourcesApi.util.updateQueryData(
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
            resourcesApi.util.updateQueryData(
              'getChecklists', 
              { cardId: parseInt(arg.cardId as string, 10) as any }, 
              cache =>  cache.filter(item => item.id !== arg.id)
              
            )
          )
        } catch {

        }
      }
    }),

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
            resourcesApi.util.updateQueryData(
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
            resourcesApi.util.updateQueryData(
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
            resourcesApi.util.updateQueryData(
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
});

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,

  useGetListsQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,

  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,

  useGetChecklistsQuery,
  useCreateChecklistMutation,
  useDeleteChecklistMutation,
  
  useGetChecklistItemsQuery,
  useCreateChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  reducer: resourcesReducer,
  middleware: resourcesMiddleware,
  util: {
    updateQueryData: updateResourcesCache
  }
} = resourcesApi;

export const reorderLists = (item: List, boardId: string, droppedId: string) => 
  updateResourcesCache(
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

export const reorderCards = (item: ListCardType, listId: string, droppedId: string) => 
  updateResourcesCache(
    'getCards', 
    {listId}, 
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

export const reorderChecklistItems = (item: ChecklistItemType, checklistId: string, droppedId: string) => 
  updateResourcesCache(
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

export type ResourcesApiState = ReturnType<typeof resourcesApi.reducer>