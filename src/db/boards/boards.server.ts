import type {
  CreateBoardArgs,
  GetBoardByIdArgs,
  GetBoardsArgs,
  UpdateBoardArgs,
} from '~/db/boards/boards.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getBoardsQuery(data: WithUserId<GetBoardsArgs>) {
  return prisma.stack.findMany({
    where: { userId: data.userId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createBoardQuery(data: WithUserId<CreateBoardArgs>) {
  const result = await prisma.stack.create({
    data: {
      userId: data.userId,
      boardTitle: data.boardTitle,
      boardColor: data.boardColor,
    },
  });

  return {
    code: 'stacks:create:success',
    message: 'success',
    data: [result],
  };
}

export function getBoardByIdQuery(data: WithUserId<GetBoardByIdArgs>) {
  return prisma.stack.findFirst({
    where: { id: data.boardId, userId: data.userId },
  });
}

export async function updateBoardQuery(data: WithUserId<UpdateBoardArgs>) {
  const result = await prisma.stack.update({
    where: { id: data.boardId, userId: data.userId },
    data: { boardTitle: data.boardTitle },
  });

  return {
    code: 'boards:update:success',
    message: 'success',
    data: [result],
  };
}
