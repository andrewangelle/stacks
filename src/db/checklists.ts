import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

const GetChecklistsSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
});

export const getChecklists = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistsSchema)
  .handler(async ({ data }) => {
    return prisma.checklist.findMany({
      where: {
        cardId: data.cardId,
        card: { list: { board: { userId: data.userId } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  });

const GetChecklistByIdSchema = z.object({
  checklistId: z.string(),
  userId: z.string(),
});

export const getChecklistById = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistByIdSchema)
  .handler(async ({ data }) => {
    const row = await prisma.checklist.findFirst({
      where: {
        id: data.checklistId,
        userId: data.userId,
      },
    });
    return row;
  });

const CreateChecklistSchema = z.object({
  userId: z.string(),
  checklistTitle: z.string(),
  cardId: z.string(),
  listId: z.string(),
});

export const createChecklist = createServerFn({ method: 'POST' })
  .inputValidator(CreateChecklistSchema)
  .handler(async ({ data }) => {
    const card = await prisma.card.findFirst({
      where: {
        id: data.cardId,
        listId: data.listId,
        list: { board: { userId: data.userId } },
      },
    });

    if (!card) {
      throw new Error('Forbidden');
    }

    const row = await prisma.checklist.create({
      data: {
        checklistTitle: data.checklistTitle,
        cardId: data.cardId,
        userId: data.userId,
        listId: data.listId,
      },
    });

    return {
      code: 'checklists:create:success',
      message: 'success',
      data: [row],
    };
  });

const DeleteChecklistSchema = z.object({
  checklistId: z.string(),
  userId: z.string(),
});

export const deleteChecklist = createServerFn({ method: 'POST' })
  .inputValidator(DeleteChecklistSchema)
  .handler(async ({ data }) => {
    const row = await prisma.checklist.findFirst({
      where: {
        id: data.checklistId,
        userId: data.userId,
      },
    });

    if (!row) {
      throw new Error('Checklist Not found');
    }

    await prisma.checklist.delete({
      where: { id: row.id },
    });

    return {
      code: 'checklists:delete:success',
      message: 'success',
      data: [row],
    };
  });
