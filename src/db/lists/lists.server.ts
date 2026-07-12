import type {
  CreateListArgs,
  DeleteListArgs,
  GetListsArgs,
  ReorderListsArgs,
  UpdateListArgs,
} from '~/db/lists/lists.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getListsQuery(data: WithUserId<GetListsArgs>) {
  return prisma.list.findMany({
    where: {
      boardId: data.boardId,
      board: { userId: data.userId },
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      listTitle: true,
      createdAt: true,
      position: true,
      boardId: true,
      cards: {
        select: {
          id: true,
          cardDescription: true,
          isCompleted: true,
          position: true,
          cardTitle: true,
          createdAt: true,
        },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });
}

export async function createListQuery(data: WithUserId<CreateListArgs>) {
  const board = await prisma.stack.findFirst({
    where: { id: data.boardId, userId: data.userId },
  });

  if (!board) {
    throw new Error('Forbidden');
  }

  const position = await prisma.list.count({
    where: { boardId: data.boardId, board: { userId: data.userId } },
  });

  const result = await prisma.list.create({
    data: {
      listTitle: data.listTitle,
      boardId: data.boardId,
      userId: data.userId,
      position,
    },
  });

  return {
    code: 'lists:create:success',
    message: 'success',
    data: [result],
  };
}

export async function updateListQuery(data: WithUserId<UpdateListArgs>) {
  const updated = await prisma.list.updateMany({
    where: { id: data.listId, userId: data.userId },
    data: {
      listTitle: data.listTitle,
    },
  });

  if (updated.count === 0) {
    return [];
  }

  return prisma.list.findMany({
    where: { id: data.listId },
  });
}

export async function deleteListQuery(data: WithUserId<DeleteListArgs>) {
  const result = await prisma.list.findFirst({
    where: {
      id: data.listId,
      userId: data.userId,
    },
  });

  if (!result) {
    throw new Error('List Not found');
  }

  await prisma.list.delete({
    where: { id: result.id },
  });

  return {
    code: 'lists:delete:success',
    message: 'success',
    data: [result],
  };
}

export async function reorderListsQuery(data: WithUserId<ReorderListsArgs>) {
  const existingLists = await prisma.list.findMany({
    where: {
      boardId: data.boardId,
      board: { userId: data.userId },
    },
    select: { id: true },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  const existingIds = new Set(existingLists.map((list) => list.id));

  if (
    data.orderedIds.length !== existingIds.size ||
    !data.orderedIds.every((id) => existingIds.has(id))
  ) {
    throw new Error('Invalid reorder');
  }

  await prisma.$transaction(
    data.orderedIds.map((id, position) =>
      prisma.list.updateMany({
        where: { id, userId: data.userId },
        data: { position },
      }),
    ),
  );

  return {
    code: 'lists:reorder:success',
    message: 'success',
  };
}
