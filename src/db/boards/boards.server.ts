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
 * Load the user's whole workspace — boards, lists, cards, and checklists with
 * their items — as one joined query, so the boards, board, and card screens all
 * render without further fetches. Every relation arrives sorted the way its
 * screen renders it; nothing downstream re-sorts or regroups.
 *
 * Card activity is deliberately absent: it grows with a card's history rather
 * than its current state, so only the comment count the card front renders is
 * joined here. The entries themselves load per card — see activity.query.ts.
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
              _count: {
                select: { activities: { where: { type: 'comment' } } },
              },
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
