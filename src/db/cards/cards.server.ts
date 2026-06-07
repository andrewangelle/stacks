import type {
  CreateCardArgs,
  DeleteCardArgs,
  GetCardByIdArgs,
  GetCardsByListIdArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getCardsByListIdQuery(data: WithUserId<GetCardsByListIdArgs>) {
  return prisma.card.findMany({
    where: {
      listId: data.listId,
      list: { board: { userId: data.userId } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export function getCardByIdQuery(data: WithUserId<GetCardByIdArgs>) {
  return prisma.card.findFirst({
    where: {
      id: data.cardId,
      list: { board: { userId: data.userId } },
    },
  });
}

export async function getBoardIdByCardIdQuery(
  data: WithUserId<GetCardByIdArgs>,
) {
  const ownershipFilter = {
    list: { board: { userId: data.userId } },
  };

  let card = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      ...ownershipFilter,
    },
    select: {
      id: true,
      list: {
        select: {
          boardId: true,
        },
      },
    },
  });

  if (!card) {
    card = await prisma.card.findFirst({
      where: {
        id: { startsWith: data.cardId },
        ...ownershipFilter,
      },
      select: {
        id: true,
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
  }

  if (!card) {
    return null;
  }

  return {
    boardId: card.list.boardId,
    cardId: card.id,
  };
}

export async function createCardQuery(data: WithUserId<CreateCardArgs>) {
  const list = await prisma.list.findFirst({
    where: { id: data.listId, board: { userId: data.userId } },
  });

  if (!list) {
    throw new Error('Forbidden');
  }

  const result = await prisma.card.create({
    data: {
      cardTitle: data.cardTitle,
      listId: data.listId,
      userId: data.userId,
    },
  });

  return {
    code: 'cards:create:success',
    message: 'success',
    data: [result],
  };
}

export async function updateCardQuery(data: WithUserId<UpdateCardArgs>) {
  const patch: {
    cardDescription?: string;
    cardTitle?: string;
    isCompleted?: boolean;
  } = {};
  if (data.cardDescription !== undefined) {
    patch.cardDescription = data.cardDescription;
  }
  if (data.cardTitle !== undefined) {
    patch.cardTitle = data.cardTitle;
  }
  if (typeof data.isCompleted === 'boolean') {
    patch.isCompleted = data.isCompleted;
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
}

export async function deleteCardQuery(data: WithUserId<DeleteCardArgs>) {
  const result = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      userId: data.userId,
    },
  });

  if (!result) {
    throw new Error('Card Not found');
  }

  await prisma.card.delete({
    where: { id: result.id },
  });

  return {
    code: 'cards:delete:success',
    message: 'success',
    cardData: [result],
  };
}
