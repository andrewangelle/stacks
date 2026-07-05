import type {
  CreateChecklistItemArgs,
  DeleteChecklistItemArgs,
  MoveChecklistItemArgs,
  ReorderChecklistItemsArgs,
  UpdateChecklistItemArgs,
} from '~/db/checklistItems/checklistItems.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export async function createChecklistItemQuery(
  data: WithUserId<CreateChecklistItemArgs>,
) {
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

  const position = await prisma.checklistItem.count({
    where: {
      checklistId: data.checklistId,
      checklist: {
        card: { list: { board: { userId: data.userId } } },
      },
    },
  });

  const result = await prisma.checklistItem.create({
    data: {
      label: data.label,
      cardId: data.cardId,
      checklistId: data.checklistId,
      listId: data.listId,
      userId: data.userId,
      isCompleted: false,
      position,
    },
  });

  return {
    code: 'checklist-item:create:success',
    message: 'success',
    data: [result],
  };
}

export async function updateChecklistItemQuery(
  data: WithUserId<UpdateChecklistItemArgs>,
) {
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
}

export async function deleteChecklistItemQuery(
  data: WithUserId<DeleteChecklistItemArgs>,
) {
  const result = await prisma.checklistItem.findFirst({
    where: {
      id: data.itemId,
      userId: data.userId,
    },
  });

  if (!result) {
    throw new Error('Checklist Item Not found');
  }

  await prisma.checklistItem.delete({
    where: { id: result.id },
  });

  return {
    code: 'checklists:delete:success',
    message: 'success',
    data: [result],
  };
}

export async function reorderChecklistItemsQuery(
  data: WithUserId<ReorderChecklistItemsArgs>,
) {
  const existingItems = await prisma.checklistItem.findMany({
    where: {
      checklistId: data.checklistId,
      checklist: {
        card: { list: { board: { userId: data.userId } } },
      },
    },
    select: { id: true },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  const existingIds = new Set(existingItems.map((item) => item.id));

  if (
    data.orderedIds.length !== existingIds.size ||
    !data.orderedIds.every((id) => existingIds.has(id))
  ) {
    throw new Error('Invalid reorder');
  }

  await prisma.$transaction(
    data.orderedIds.map((id, position) =>
      prisma.checklistItem.updateMany({
        where: { id, userId: data.userId },
        data: { position },
      }),
    ),
  );

  return {
    code: 'checklist-items:reorder:success',
    message: 'success',
  };
}

/**
 * Move a checklist item to another checklist on the same card. Items cannot move
 * between cards. Same pattern as moveCardQuery: update foreign key, then renumber
 * positions in both source and target checklists inside one transaction.
 */
export async function moveChecklistItemQuery(
  data: WithUserId<MoveChecklistItemArgs>,
) {
  const item = await prisma.checklistItem.findFirst({
    where: {
      id: data.itemId,
      checklistId: data.sourceChecklistId,
      userId: data.userId,
    },
    select: { id: true, cardId: true, listId: true },
  });

  if (!item) {
    throw new Error('Forbidden');
  }

  const targetChecklist = await prisma.checklist.findFirst({
    where: {
      id: data.targetChecklistId,
      cardId: item.cardId,
      userId: data.userId,
    },
  });

  if (!targetChecklist || data.sourceChecklistId === data.targetChecklistId) {
    throw new Error('Invalid move');
  }

  await prisma.$transaction(async (tx) => {
    const checklistOwnership = {
      checklist: {
        card: { list: { board: { userId: data.userId } } },
      },
    };

    const sourceItems = await tx.checklistItem.findMany({
      where: { checklistId: data.sourceChecklistId, ...checklistOwnership },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    const targetItems = await tx.checklistItem.findMany({
      where: { checklistId: data.targetChecklistId, ...checklistOwnership },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    await tx.checklistItem.updateMany({
      where: { id: data.itemId, userId: data.userId },
      data: {
        checklistId: data.targetChecklistId,
      },
    });

    const remainingSource = sourceItems.filter(
      (sourceItem) => sourceItem.id !== data.itemId,
    );

    for (let position = 0; position < remainingSource.length; position++) {
      await tx.checklistItem.updateMany({
        where: { id: remainingSource[position].id, userId: data.userId },
        data: { position },
      });
    }

    const targetIds = targetItems.map((targetItem) => targetItem.id);
    const clampedIndex = Math.min(
      Math.max(data.targetIndex, 0),
      targetIds.length,
    );
    targetIds.splice(clampedIndex, 0, data.itemId);

    for (let position = 0; position < targetIds.length; position++) {
      await tx.checklistItem.updateMany({
        where: { id: targetIds[position], userId: data.userId },
        data: { position },
      });
    }
  });

  return {
    code: 'checklist-items:move:success',
    message: 'success',
  };
}
