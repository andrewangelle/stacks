import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

const GetCardsSchema = z.object({
  listId: z.string(),
  userId: z.string(),
});

export const getCards = createServerFn({ method: 'GET' })
  .inputValidator(GetCardsSchema)
  .handler(async ({ data }) => {
    if (!data.listId) {
      return [];
    }

    return prisma.card.findMany({
      where: {
        listId: data.listId,
        list: { board: { userId: data.userId } },
      },
      orderBy: { createdAt: 'asc' },
    });
  });

const GetCardByIdSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
});

export const getCardById = createServerFn({ method: 'GET' })
  .inputValidator(GetCardByIdSchema)
  .handler(async ({ data }) => {
    const card = await prisma.card.findFirst({
      where: {
        id: data.cardId,
        list: { board: { userId: data.userId } },
      },
    });

    return card;
  });

const CreateCardSchema = z.object({
  userId: z.string(),
  listId: z.string(),
  cardTitle: z.string(),
});

export const createCard = createServerFn({ method: 'POST' })
  .inputValidator(CreateCardSchema)
  .handler(async ({ data }) => {
    const list = await prisma.list.findFirst({
      where: { id: data.listId, board: { userId: data.userId } },
    });

    if (!list) {
      throw new Error('Forbidden');
    }

    const row = await prisma.card.create({
      data: {
        cardTitle: data.cardTitle,
        listId: data.listId,
        userId: data.userId,
      },
    });

    return {
      code: 'cards:create:success',
      message: 'success',
      data: [row],
    };
  });

const UpdateCardSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  cardDescription: z.string().optional(),
  cardTitle: z.string().optional(),
});

export const updateCard = createServerFn({ method: 'POST' })
  .inputValidator(UpdateCardSchema)
  .handler(async ({ data }) => {
    const patch: { cardDescription?: string; cardTitle?: string } = {};
    if (data.cardDescription) {
      patch.cardDescription = data.cardDescription;
    }
    if (data.cardTitle) {
      patch.cardTitle = data.cardTitle;
    }

    await prisma.card.updateMany({
      where: {
        id: data.cardId,
        userId: data.userId,
      },
      data: patch,
    });

    return prisma.card.findMany({
      where: { id: data.cardId },
    });
  });

const DeleteCardSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
});

export const deleteCard = createServerFn({ method: 'POST' })
  .inputValidator(DeleteCardSchema)
  .handler(async ({ data }) => {
    const row = await prisma.card.findFirst({
      where: {
        id: data.cardId,
        userId: data.userId,
      },
    });

    if (!row) {
      throw new Error('Card Not found');
    }

    await prisma.card.delete({
      where: { id: row.id },
    });

    return {
      code: 'cards:delete:success',
      message: 'success',
      cardData: [row],
    };
  });
