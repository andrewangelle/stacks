import type {
  CreateListArgs,
  DeleteListArgs,
  GetListByIdArgs,
  GetListsArgs,
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
    orderBy: { createdAt: 'asc' },
    select: { id: true, listTitle: true, createdAt: true },
  });
}

export function getListByIdQuery(data: WithUserId<GetListByIdArgs>) {
  return prisma.list.findFirst({
    where: { id: data.id, userId: data.userId },
  });
}

export async function createListQuery(data: WithUserId<CreateListArgs>) {
  const board = await prisma.stack.findFirst({
    where: { id: data.boardId, userId: data.userId },
  });

  if (!board) {
    throw new Error('Forbidden');
  }

  const result = await prisma.list.create({
    data: {
      listTitle: data.listTitle,
      boardId: data.boardId,
      userId: data.userId,
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
