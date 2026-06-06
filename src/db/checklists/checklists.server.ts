import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetCardChecklistViewArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
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
    orderBy: { createdAt: 'asc' },
  });
}

export function getChecklistByIdQuery(data: WithUserId<GetChecklistByIdArgs>) {
  return prisma.checklist.findFirst({
    where: {
      id: data.checklistId,
      userId: data.userId,
    },
  });
}

export async function getCardChecklistViewQuery(
  data: WithUserId<GetCardChecklistViewArgs>,
) {
  const checklists = await prisma.checklist.findMany({
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
    orderBy: { createdAt: 'asc' },
  });

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

  const result = await prisma.checklist.create({
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
  const patch: { checklistTitle?: string } = {};

  if (typeof data.checklistTitle === 'string') {
    patch.checklistTitle = data.checklistTitle;
  }

  return prisma.checklist.update({
    where: { id: data.checklistId, userId: data.userId },
    data: patch,
  });
}
