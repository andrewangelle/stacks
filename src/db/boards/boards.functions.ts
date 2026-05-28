import { createServerFn } from '@tanstack/react-start';
import {
  CreateBoardSchema,
  GetBoardByIdSchema,
  GetBoardsSchema,
  UpdateBoardSchema,
} from '~/db/boards/boards.schemas';
import {
  createBoardQuery,
  getBoardByIdQuery,
  getBoardsQuery,
  updateBoardQuery,
} from '~/db/boards/boards.server';
import { authMiddleware } from '~/middleware/auth';

export const getBoards = createServerFn({ method: 'GET' })
  .inputValidator(GetBoardsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getBoardsQuery({ ...data, userId: context.uid }),
  );

export const createBoard = createServerFn({ method: 'POST' })
  .inputValidator(CreateBoardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createBoardQuery({ ...data, userId: context.uid }),
  );

export const getBoardById = createServerFn({ method: 'GET' })
  .inputValidator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getBoardByIdQuery({ ...data, userId: context.uid }),
  );

export const updateBoard = createServerFn({ method: 'POST' })
  .inputValidator(UpdateBoardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateBoardQuery({ ...data, userId: context.uid }),
  );
