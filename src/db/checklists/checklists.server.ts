import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
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
