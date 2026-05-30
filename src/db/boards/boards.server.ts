import type {
  CreateBoardArgs,
  GetBoardByIdArgs,
  UpdateBoardArgs,
} from '~/db/boards/boards.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getBoardsQuery(data: { userId: string }) {
  return prisma.stack.findMany({
    where: { userId: data.userId },
    orderBy: { createdAt: 'asc' },
  });
}

export function createBoardQuery(data: WithUserId<CreateBoardArgs>) {
  return prisma.stack.create({
    data: {
      userId: data.userId,
      boardTitle: data.boardTitle,
      boardColor: data.boardColor,
    },
  });
}

export function getBoardByIdQuery(data: WithUserId<GetBoardByIdArgs>) {
  return prisma.stack.findFirst({
    where: { id: data.boardId, userId: data.userId },
  });
}

export function updateBoardQuery(data: WithUserId<UpdateBoardArgs>) {
  return prisma.stack.update({
    where: { id: data.boardId, userId: data.userId },
    data: { boardTitle: data.boardTitle },
  });
}
