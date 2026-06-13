import type {
  CreateChecklistItemArgs,
  DeleteChecklistItemArgs,
  GetChecklistItemByIdArgs,
  GetChecklistItemsArgs,
  ReorderChecklistItemsArgs,
  UpdateChecklistItemArgs,
} from '~/db/checklistItems/checklistItems.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getChecklistItemsQuery(
  data: WithUserId<GetChecklistItemsArgs>,
) {
  return prisma.checklistItem.findMany({
    where: {
      checklistId: data.checklistId,
      checklist: {
        card: { list: { board: { userId: data.userId } } },
      },
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, label: true, isCompleted: true, createdAt: true },
  });
}

export function getChecklistItemByIdQuery(
  data: WithUserId<GetChecklistItemByIdArgs>,
) {
  return prisma.checklistItem.findFirst({
    where: { id: data.itemId, userId: data.userId },
  });
}

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
