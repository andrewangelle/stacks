import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

const GetChecklistItemsSchema = z.object({
  checklistId: z.string(),
  userId: z.string(),
});

export const getChecklistItems = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistItemsSchema)
  .handler(async ({ data }) => {
    return prisma.checklistItem.findMany({
      where: {
        checklistId: data.checklistId,
        checklist: {
          card: { list: { board: { userId: data.userId } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  });

const GetChecklistItemByIdSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
});

export const getChecklistItemById = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistItemByIdSchema)
  .handler(async ({ data }) => {
    const row = await prisma.checklistItem.findFirst({
      where: { id: data.itemId, userId: data.userId },
    });
    return row;
  });

const CreateChecklistItemSchema = z.object({
  userId: z.string(),
  label: z.string(),
  cardId: z.string(),
  checklistId: z.string(),
  listId: z.string(),
});

export const createChecklistItem = createServerFn({ method: 'POST' })
  .inputValidator(CreateChecklistItemSchema)
  .handler(async ({ data }) => {
    const checklist = await prisma.checklist.findFirst({
      where: {
        id: data.checklistId,
        cardId: data.cardId,
        listId: data.listId,
        userId: data.userId,
      },
    });

    if (!checklist) {
      throw new Error('Forbidden');
    }

    const row = await prisma.checklistItem.create({
      data: {
        label: data.label,
        cardId: data.cardId,
        checklistId: data.checklistId,
        listId: data.listId,
        userId: data.userId,
        isCompleted: false,
      },
    });

    return {
      code: 'checklist-item:create:success',
      message: 'success',
      data: [row],
    };
  });

const UpdateChecklistItemSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
  label: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const updateChecklistItem = createServerFn({ method: 'POST' })
  .inputValidator(UpdateChecklistItemSchema)
  .handler(async ({ data }) => {
    const patch: { label?: string; isCompleted?: boolean } = {};

    if (typeof data.label === 'string') {
      patch.label = data.label;
    }

    if (typeof data.isCompleted === 'boolean') {
      patch.isCompleted = data.isCompleted;
    }

    await prisma.checklistItem.updateMany({
      where: {
        id: data.itemId,
        userId: data.userId,
      },
      data: patch,
    });

    return prisma.checklistItem.findMany({
      where: { id: data.itemId },
    });
  });

const DeleteChecklistItemSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
});

export const deleteChecklistItem = createServerFn({ method: 'POST' })
  .inputValidator(DeleteChecklistItemSchema)
  .handler(async ({ data }) => {
    const row = await prisma.checklistItem.findFirst({
      where: {
        id: data.itemId,
        userId: data.userId,
      },
    });

    if (!row) {
      throw new Error('Checklist Item Not found');
    }

    await prisma.checklistItem.delete({
      where: { id: row.id },
    });

    return {
      code: 'checklists:delete:success',
      message: 'success',
      data: [row],
    };
  });
