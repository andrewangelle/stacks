import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

const GetActivitySchema = z.object({
  cardId: z.string(),
  userId: z.string(),
});

export const getActivity = createServerFn({ method: 'GET' })
  .inputValidator(GetActivitySchema)
  .handler(async ({ data }) => {
    const response = await prisma.activity.findMany({
      where: {
        cardId: data.cardId,
        card: { list: { board: { userId: data.userId } } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return response;
  });

const CreateActivitySchema = z.object({
  userId: z.string(),
  listId: z.string(),
  cardId: z.string(),
  boardId: z.string(),
  content: z.string(),
  type: z.string(),
});

export const createActivity = createServerFn({ method: 'POST' })
  .inputValidator(CreateActivitySchema)
  .handler(async ({ data }) => {
    const board = await prisma.stack.findFirst({
      where: { id: data.boardId, userId: data.userId },
    });

    if (!board) {
      throw new Error('Forbidden');
    }

    const row = await prisma.activity.create({
      data: {
        listId: data.listId,
        cardId: data.cardId,
        boardId: data.boardId,
        userId: data.userId,
        content: data.content,
        type: data.type,
      },
    });

    return {
      code: 'activity:create:success',
      message: 'success',
      data: [row],
    };
  });

const UpdateActivitySchema = z.object({
  activityId: z.string(),
  userId: z.string(),
  content: z.string(),
});

export const updateActivity = createServerFn({ method: 'POST' })
  .inputValidator(UpdateActivitySchema)
  .handler(async ({ data }) => {
    await prisma.activity.updateMany({
      where: {
        id: data.activityId,
        userId: data.userId,
      },
      data: {
        content: data.content,
      },
    });

    return prisma.activity.findMany({
      where: { id: data.activityId },
    });
  });

const DeleteActivitySchema = z.object({
  activityId: z.string(),
  userId: z.string(),
});

export const deleteActivity = createServerFn({ method: 'POST' })
  .inputValidator(DeleteActivitySchema)
  .handler(async ({ data }) => {
    const row = await prisma.activity.findFirst({
      where: {
        id: data.activityId,
        userId: data.userId,
      },
    });

    if (!row) {
      throw new Error('Activity Not found');
    }

    await prisma.activity.delete({
      where: { id: row.id },
    });

    return {
      code: 'activity:delete:success',
      message: 'success',
      data: [row],
    };
  });
