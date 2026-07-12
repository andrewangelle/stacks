import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
  ReorderChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getChecklistsQuery(data: WithUserId<GetChecklistsArgs>) {
  return prisma.checklist.findMany({
    where: {
      cardId: data.cardId,
      card: { list: { board: { userId: data.userId } } },
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, checklistTitle: true, createdAt: true, items: true },
  });
}

export function getChecklistByIdQuery(data: WithUserId<GetChecklistByIdArgs>) {
  return prisma.checklist.findFirst({
    where: {
      id: data.checklistId,
      userId: data.userId,
    },
    select: {
      cardId: true,
      listId: true,
      userId: true,
      checklistTitle: true,
      createdAt: true,
      position: true,
      hideCheckedItems: true,
      items: {
        where: { checklistId: data.checklistId },
      },
    },
  });
}

export async function getCardTitleDetailsChecklistsQuery(
  data: WithUserId<GetChecklistsArgs>,
) {
  const [card, checklists] = await Promise.all([
    prisma.card.findFirst({
      where: {
        id: data.cardId,
        list: { board: { userId: data.userId } },
      },
      select: {
        isChecklistsExpanded: true,
        expandedChecklistId: true,
      },
    }),
    prisma.checklist.findMany({
      where: {
        cardId: data.cardId,
        card: { list: { board: { userId: data.userId } } },
        items: { some: { cardId: data.cardId } },
      },
      select: {
        id: true,
        checklistTitle: true,
        items: {
          where: { cardId: data.cardId },
          select: {
            label: true,
            isCompleted: true,
          },
        },
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    }),
  ]);

  let completedItemsForCard = 0;
  let totalItemsForCard = 0;

  const checklistsWithStats = checklists.map((checklist) => {
    const completedItems = checklist.items.filter((item) => item.isCompleted);
    const totalItems = checklist.items.length;

    completedItemsForCard += completedItems.length;
    totalItemsForCard += totalItems;

    return {
      id: checklist.id,
      checklistTitle: checklist.checklistTitle,
      completedItems: completedItems.length,
      totalItems,
      titles: completedItems.map((item) => item.label),
    };
  });

  return {
    isChecklistsExpanded: card?.isChecklistsExpanded ?? false,
    expandedChecklistId: card?.expandedChecklistId ?? null,
    completedItemsForCard,
    totalItemsForCard,
    checklists: checklistsWithStats.filter(
      (checklist) => checklist.totalItems > 0,
    ),
  };
}

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
