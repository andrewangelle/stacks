import type {
  CreateCardArgs,
  DeleteCardArgs,
  GetCardByIdArgs,
  GetCardsByListIdArgs,
  MoveCardArgs,
  ReorderCardsArgs,
  SetCardChecklistExpandedArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';
import type { Prisma } from '~/generated/prisma/client';

export function getCardsByListIdQuery(data: WithUserId<GetCardsByListIdArgs>) {
  return prisma.card.findMany({
    where: {
      listId: data.listId,
      list: { board: { userId: data.userId } },
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
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
          board: {
            select: {
              boardColor: true,
            },
          },
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
            board: {
              select: {
                boardColor: true,
              },
            },
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
    boardColor: card.list.board.boardColor,
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

export async function setCardChecklistExpandedQuery(
  data: WithUserId<SetCardChecklistExpandedArgs>,
) {
  const patch: {
    isChecklistsExpanded?: boolean;
    expandedChecklistId?: string | null;
  } = {};

  if (typeof data.isChecklistsExpanded === 'boolean') {
    patch.isChecklistsExpanded = data.isChecklistsExpanded;
  }

  if (data.expandedChecklistId !== undefined) {
    if (data.expandedChecklistId) {
      // Only point at a checklist that actually belongs to this card.
      const checklist = await prisma.checklist.findFirst({
        where: {
          id: data.expandedChecklistId,
          cardId: data.cardId,
          userId: data.userId,
        },
        select: { id: true },
      });
      patch.expandedChecklistId = checklist ? checklist.id : null;
    } else {
      patch.expandedChecklistId = null;
    }
  }

  await prisma.card.updateMany({
    where: { id: data.cardId, userId: data.userId },
    data: patch,
  });

  return prisma.card.findFirst({
    where: { id: data.cardId, userId: data.userId },
    select: {
      id: true,
      isChecklistsExpanded: true,
      expandedChecklistId: true,
    },
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
 * Move a card to a position within any list the user owns — same list, another list on the
 * same board, or a list on a different board. Rewrites positions so order stays contiguous
 * and records the transfer in the card's activity feed: board links when the board changes,
 * list links when only the list changes, and nothing for a same-list reposition.
 */
export async function moveCardQuery(data: WithUserId<MoveCardArgs>) {
  const card = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      listId: data.sourceListId,
      userId: data.userId,
      list: { board: { userId: data.userId } },
    },
    select: { id: true, list: { select: { boardId: true } } },
  });

  if (!card) {
    throw new Error('Forbidden');
  }

  const targetList = await prisma.list.findFirst({
    where: { id: data.targetListId, board: { userId: data.userId } },
  });

  if (!targetList) {
    throw new Error('Invalid move');
  }

  const movedToNewList = data.sourceListId !== data.targetListId;

  await prisma.$transaction(async (tx) => {
    if (movedToNewList) {
      await tx.card.updateMany({
        where: { id: data.cardId, userId: data.userId },
        data: { listId: data.targetListId },
      });
      const sourceIds = await orderedCardIds(
        tx,
        data.userId,
        data.sourceListId,
      );
      await renumber(tx, data.userId, sourceIds);
    }

    const targetIds = withCardAt(
      await orderedCardIds(tx, data.userId, data.targetListId),
      data.cardId,
      data.targetIndex,
    );
    await renumber(tx, data.userId, targetIds);
  });

  await recordCardMoveActivity(data, {
    sourceBoardId: card.list.boardId,
    targetBoardId: targetList.boardId,
  });

  return { code: 'cards:move:success', message: 'success' };
}

/** A list's card ids in display order. */
async function orderedCardIds(
  tx: Prisma.TransactionClient,
  userId: string,
  listId: string,
) {
  const cards = await tx.card.findMany({
    where: { listId, list: { board: { userId } } },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: { id: true },
  });
  return cards.map((card) => card.id);
}

/** `ids` with `cardId` placed at `index`, dropping any existing entry first. */
function withCardAt(ids: string[], cardId: string, index: number) {
  const rest = ids.filter((id) => id !== cardId);
  const clampedIndex = Math.min(Math.max(index, 0), rest.length);
  rest.splice(clampedIndex, 0, cardId);
  return rest;
}

/** Persist `orderedIds` as contiguous 0-based positions. */
async function renumber(
  tx: Prisma.TransactionClient,
  userId: string,
  orderedIds: string[],
) {
  for (let position = 0; position < orderedIds.length; position++) {
    await tx.card.updateMany({
      where: { id: orderedIds[position], userId },
      data: { position },
    });
  }
}

/** Log the move to the card's activity feed, unless it was a same-list reposition. */
async function recordCardMoveActivity(
  data: WithUserId<MoveCardArgs>,
  boards: { sourceBoardId: string; targetBoardId: string },
) {
  const link = transferLink(data, boards);

  if (!link) {
    return;
  }

  const entry = {
    cardId: data.cardId,
    listId: data.targetListId,
    boardId: boards.targetBoardId,
    userId: data.userId,
    type: 'feed',
  };

  await prisma.activity.create({
    data: {
      ...entry,
      content: `transferred this card from {{ ${link.from} }}`,
    },
  });
  await prisma.activity.create({
    data: { ...entry, content: `transferred this card to {{ ${link.to} }}` },
  });
}

/**
 * Link tokens describing the move: board links when the board changed, list links when only
 * the list changed, or null for a same-list reposition (no activity).
 */
function transferLink(
  data: WithUserId<MoveCardArgs>,
  boards: { sourceBoardId: string; targetBoardId: string },
) {
  if (boards.sourceBoardId !== boards.targetBoardId) {
    return {
      from: `linkToBoard:${boards.sourceBoardId}`,
      to: `linkToBoard:${boards.targetBoardId}`,
    };
  }

  if (data.sourceListId !== data.targetListId) {
    return {
      from: `linkToList:${data.sourceListId}`,
      to: `linkToList:${data.targetListId}`,
    };
  }

  return null;
}
