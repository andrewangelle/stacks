import { resourcesApi } from "~/store";

export type ListCardType = {
  id: string;
  created_at: string;
  listId: string;
  userId: string;
  cardTitle: string;
  cardDescription: string;
}

const cardsApi = resourcesApi.injectEndpoints({
  endpoints: builder => ({
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
            cardsApi.util.updateQueryData(
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
            cardsApi.util.updateQueryData(
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
            cardsApi.util.updateQueryData(
              'getCards', 
              { listId: arg.listId }, 
              cache => cache.filter(item => item.id !== arg.id)
            )
          )
        } catch {

        }
      }
    }),

  })
});

export const {
  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  util: {
    updateQueryData: updateCardsCache
  }
} = cardsApi;

export const reorderCards = (item: ListCardType, listId: string, droppedId: string) => 
  updateCardsCache(
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