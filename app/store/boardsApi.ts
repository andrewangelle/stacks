import { resourcesApi } from "~/store";

export type Board = {
  id: string;
  boardColor: string;
  boardTitle: string;
  userId: string;
};

const boardsApi = resourcesApi.injectEndpoints({
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
            boardsApi.util.updateQueryData(
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
  })
});

export const {
  useGetBoardQuery,
  useGetBoardsQuery,
  useCreateBoardMutation,
  util: {
    updateQueryData: updateBoardsCache
  }
} = boardsApi

