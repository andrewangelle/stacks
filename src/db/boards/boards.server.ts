import type {
  CreateBoardArgs,
  GetBoardByIdArgs,
  UpdateBoardArgs,
} from '~/db/boards/boards.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getBoardColorQuery(data: WithUserId<GetBoardByIdArgs>) {
  return prisma.stack.findFirst({
    where: { id: { startsWith: data.boardId }, userId: data.userId },
    select: { boardColor: true },
  });
}

/**
 * Load the user's whole workspace — boards, lists, cards, checklists with their
 * items, and card activity — as one joined query. `setCache` in boards.cache.ts
 * fans this payload out to every per-entity query cache, so the boards, board,
 * and card screens all render without further fetches. Every relation arrives
 * sorted the way its screen renders it; nothing downstream re-sorts or regroups.
 */
export function getBoardsQuery(data: { userId: string }) {
  return prisma.stack.findMany({
    relationLoadStrategy: 'join',
    where: { userId: data.userId },
    orderBy: { createdAt: 'asc' },
    include: {
      lists: {
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        include: {
          cards: {
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            include: {
              checklists: {
                orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
                include: {
                  items: {
                    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
                  },
                },
              },
              activities: { orderBy: { createdAt: 'desc' } },
            },
          },
        },
      },
    },
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

export function updateBoardQuery(data: WithUserId<UpdateBoardArgs>) {
  return prisma.stack.update({
    where: { id: data.boardId, userId: data.userId },
    data: { boardTitle: data.boardTitle, boardColor: data.boardColor },
  });
}
