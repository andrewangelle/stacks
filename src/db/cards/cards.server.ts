import type {
  CreateCardArgs,
  DeleteCardArgs,
  GetCardByIdArgs,
  GetCardsByListIdArgs,
  MoveCardArgs,
  ReorderCardsArgs,
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
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, cardTitle: true, createdAt: true },
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

  const listOwnership = {
    listId: data.listId,
    list: { board: { userId: data.userId } },
  };

  if (data.position === undefined) {
    const position = await prisma.card.count({
      where: listOwnership,
    });

    const result = await prisma.card.create({
      data: {
        cardTitle: data.cardTitle,
        listId: data.listId,
        userId: data.userId,
        position,
      },
    });

    return {
      code: 'cards:create:success',
      message: 'success',
      data: [result],
    };
  }

  const insertPosition = data.position;

  const result = await prisma.$transaction(async (tx) => {
    const existingCards = await tx.card.findMany({
      where: listOwnership,
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    const clampedPosition = Math.min(
      Math.max(insertPosition, 0),
      existingCards.length,
    );

    const newCard = await tx.card.create({
      data: {
        cardTitle: data.cardTitle,
        listId: data.listId,
        userId: data.userId,
        position: clampedPosition,
      },
    });

    const orderedIds = existingCards.map((card) => card.id);
    orderedIds.splice(clampedPosition, 0, newCard.id);

    for (let position = 0; position < orderedIds.length; position++) {
      await tx.card.updateMany({
        where: { id: orderedIds[position], userId: data.userId },
        data: { position },
      });
    }

    return { ...newCard, position: clampedPosition };
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

export async function reorderCardsQuery(data: WithUserId<ReorderCardsArgs>) {
  const existingCards = await prisma.card.findMany({
    where: {
      listId: data.listId,
      list: { board: { userId: data.userId } },
    },
    select: { id: true },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  const existingIds = new Set(existingCards.map((card) => card.id));

  if (
    data.orderedIds.length !== existingIds.size ||
    !data.orderedIds.every((id) => existingIds.has(id))
  ) {
    throw new Error('Invalid reorder');
  }

  await prisma.$transaction(
    data.orderedIds.map((id, position) =>
      prisma.card.updateMany({
        where: { id, userId: data.userId },
        data: { position },
      }),
    ),
  );

  return {
    code: 'cards:reorder:success',
    message: 'success',
  };
}

/**
 * Move a card to another list on the same board. Updates listId and rewrites position
 * on both source and target lists so order stays contiguous. Validates board ownership
 * so cards cannot hop between boards.
 */
export async function moveCardQuery(data: WithUserId<MoveCardArgs>) {
  const card = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      listId: data.sourceListId,
      userId: data.userId,
      list: { board: { userId: data.userId } },
    },
    select: {
      id: true,
      list: { select: { boardId: true } },
    },
  });

  if (!card) {
    throw new Error('Forbidden');
  }

  const targetList = await prisma.list.findFirst({
    where: {
      id: data.targetListId,
      boardId: card.list.boardId,
      board: { userId: data.userId },
    },
  });

  if (!targetList || data.sourceListId === data.targetListId) {
    throw new Error('Invalid move');
  }

  await prisma.$transaction(async (tx) => {
    const listOwnership = {
      list: { board: { userId: data.userId } },
    };

    const sourceCards = await tx.card.findMany({
      where: { listId: data.sourceListId, ...listOwnership },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    const targetCards = await tx.card.findMany({
      where: { listId: data.targetListId, ...listOwnership },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    await tx.card.updateMany({
      where: { id: data.cardId, userId: data.userId },
      data: { listId: data.targetListId },
    });

    const remainingSource = sourceCards.filter(
      (sourceCard) => sourceCard.id !== data.cardId,
    );

    for (let position = 0; position < remainingSource.length; position++) {
      await tx.card.updateMany({
        where: { id: remainingSource[position].id, userId: data.userId },
        data: { position },
      });
    }

    const targetIds = targetCards.map((targetCard) => targetCard.id);
    const clampedIndex = Math.min(
      Math.max(data.targetIndex, 0),
      targetIds.length,
    );
    targetIds.splice(clampedIndex, 0, data.cardId);

    for (let position = 0; position < targetIds.length; position++) {
      await tx.card.updateMany({
        where: { id: targetIds[position], userId: data.userId },
        data: { position },
      });
    }
  });

  return {
    code: 'cards:move:success',
    message: 'success',
  };
}
