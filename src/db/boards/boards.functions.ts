import { createServerFn } from '@tanstack/react-start';
import {
  CreateBoardSchema,
  GetBoardByIdSchema,
  UpdateBoardSchema,
} from '~/db/boards/boards.schemas';
import {
  createBoardQuery,
  getBoardColorQuery,
  getBoardsQuery,
  updateBoardQuery,
} from '~/db/boards/boards.server';
import { authMiddleware } from '~/middleware/auth';

export const getBoards = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getBoardsQuery({ userId: context.uid }));

export const createBoard = createServerFn({ method: 'POST' })
  .validator(CreateBoardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createBoardQuery({ ...data, userId: context.uid }),
  );

export const getBoardColor = createServerFn({ method: 'GET' })
  .validator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getBoardColorQuery({ ...data, userId: context.uid }),
  );

export const updateBoard = createServerFn({ method: 'POST' })
  .validator(UpdateBoardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateBoardQuery({ ...data, userId: context.uid }),
  );
