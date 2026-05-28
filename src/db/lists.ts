import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

/** */
const GetListsSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
});

const GetListByIdSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

const CreateListSchema = z.object({
  userId: z.string(),
  boardId: z.string(),
  listTitle: z.string(),
});

const UpdateListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
  listTitle: z.string(),
});

const DeleteListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
});

/** */
export const getLists = createServerFn({ method: 'GET' })
  .inputValidator(GetListsSchema)
  .handler(async ({ data }) => {
    return prisma.list.findMany({
      where: {
        boardId: data.boardId,
        board: { userId: data.userId },
      },
      orderBy: { createdAt: 'asc' },
    });
  });

export const getListById = createServerFn({ method: 'GET' })
  .inputValidator(GetListByIdSchema)
  .handler(async ({ data }) => {
    return prisma.list.findFirst({
      where: { id: data.id, userId: data.userId },
    });
  });

export const createList = createServerFn({ method: 'POST' })
  .inputValidator(CreateListSchema)
  .handler(async ({ data }) => {
    const board = await prisma.stack.findFirst({
      where: { id: data.boardId, userId: data.userId },
    });

    if (!board) {
      throw new Error('Forbidden');
    }

    const row = await prisma.list.create({
      data: {
        listTitle: data.listTitle,
        boardId: data.boardId,
        userId: data.userId,
      },
    });

    return {
      code: 'lists:create:success',
      message: 'success',
      data: [row],
    };
  });

export const updateList = createServerFn({ method: 'POST' })
  .inputValidator(UpdateListSchema)
  .handler(async ({ data }) => {
    const updated = await prisma.list.updateMany({
      where: { id: data.listId, userId: data.userId },
      data: {
        listTitle: data.listTitle,
      },
    });

    if (updated.count === 0) {
      return [];
    }

    return prisma.list.findMany({
      where: { id: data.listId },
    });
  });

export const deleteList = createServerFn({ method: 'POST' })
  .inputValidator(DeleteListSchema)
  .handler(async ({ data }) => {
    const row = await prisma.list.findFirst({
      where: {
        id: data.listId,
        userId: data.userId,
      },
    });

    if (!row) {
      throw new Error('List Not found');
    }

    await prisma.list.delete({
      where: { id: row.id },
    });

    return {
      code: 'lists:delete:success',
      message: 'success',
      data: [row],
    };
  });
