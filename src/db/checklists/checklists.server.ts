import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  ReorderChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export async function createChecklistQuery(
  data: WithUserId<CreateChecklistArgs>,
) {
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

  const position = await prisma.checklist.count({
    where: {
      cardId: data.cardId,
      card: { list: { board: { userId: data.userId } } },
    },
  });

  const result = await prisma.checklist.create({
    data: {
      checklistTitle: data.checklistTitle,
      cardId: data.cardId,
      userId: data.userId,
      listId: data.listId,
      position,
    },
  });

  return {
    code: 'checklists:create:success',
    message: 'success',
    data: [result],
  };
}

export async function deleteChecklistQuery(
  data: WithUserId<DeleteChecklistArgs>,
) {
  const result = await prisma.checklist.findFirst({
    where: {
      id: data.checklistId,
      userId: data.userId,
    },
  });

  if (!result) {
    throw new Error('Checklist Not found');
  }

  await prisma.checklist.delete({
    where: { id: result.id },
  });

  return {
    code: 'checklists:delete:success',
    message: 'success',
    data: [result],
  };
}

export async function updateChecklistQuery(
  data: WithUserId<UpdateChecklistArgs>,
) {
  const patch: { checklistTitle?: string; hideCheckedItems?: boolean } = {};

  if (typeof data.checklistTitle === 'string') {
    patch.checklistTitle = data.checklistTitle;
  }

  if (typeof data.hideCheckedItems === 'boolean') {
    patch.hideCheckedItems = data.hideCheckedItems;
  }

  return prisma.checklist.update({
    where: { id: data.checklistId, userId: data.userId },
    data: patch,
  });
}

export async function reorderChecklistsQuery(
  data: WithUserId<ReorderChecklistsArgs>,
) {
  const existingChecklists = await prisma.checklist.findMany({
    where: {
      cardId: data.cardId,
      card: { list: { board: { userId: data.userId } } },
    },
    select: { id: true },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  const existingIds = new Set(
    existingChecklists.map((checklist) => checklist.id),
  );

  if (
    data.orderedIds.length !== existingIds.size ||
    !data.orderedIds.every((id) => existingIds.has(id))
  ) {
    throw new Error('Invalid reorder');
  }

  await prisma.$transaction(
    data.orderedIds.map((id, position) =>
      prisma.checklist.updateMany({
        where: { id, userId: data.userId },
        data: { position },
      }),
    ),
  );

  return {
    code: 'checklists:reorder:success',
    message: 'success',
  };
}
