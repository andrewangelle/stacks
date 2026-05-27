import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

/**
 * GET /boards
 */
const GetBoardsSchema = z.object({
  userId: z.string(),
});

export const getBoards = createServerFn({ method: 'GET' })
  .inputValidator(GetBoardsSchema)
  .handler(async ({ data }) => {
    const response = await prisma.stack.findMany({
      where: { userId: data.userId },
      orderBy: { createdAt: 'asc' },
    });
    return response;
  });

/**
 * POST /boards
 */
const CreateBoardSchema = z.object({
  userId: z.string(),
  boardTitle: z.string(),
  boardColor: z.string(),
});

export const createBoard = createServerFn({ method: 'POST' })
  .inputValidator(CreateBoardSchema)
  .handler(async ({ data }) => {
    const { userId, boardTitle, boardColor } = data;

    const row = await prisma.stack.create({
      data: {
        boardTitle,
        boardColor,
        userId,
      },
    });

    return {
      code: 'stacks:create:success',
      message: 'success',
      data: [row],
    };
  });

/**
 * GET /boards/:boardId
 */
const GetBoardByIdSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
});

export const getBoardById = createServerFn({ method: 'GET' })
  .inputValidator(GetBoardByIdSchema)
  .handler(async ({ data }) => {
    const board = await prisma.stack.findFirst({
      where: { id: data.boardId, userId: data.userId },
    });

    return board;
  });

/**
 * PUT /boards/:boardId
 */
const UpdateBoardSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
  boardTitle: z.string(),
});

export const updateBoard = createServerFn({ method: 'POST' })
  .inputValidator(UpdateBoardSchema)
  .handler(async ({ data }) => {
    const board = await prisma.stack.update({
      where: { id: data.boardId, userId: data.userId },
      data: { boardTitle: data.boardTitle },
    });

    return {
      code: 'boards:update:success',
      message: 'success',
      data: [board],
    };
  });
