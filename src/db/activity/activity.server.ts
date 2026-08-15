import type {
  CreateActivityArgs,
  DeleteActivityArgs,
  GetActivityArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export const ACTIVITY_PAGE_SIZE = 10;

/**
 * Keyset pagination: `createdAt` alone is not unique, so the sort is broken by
 * `id` to give the rows a total order. That total order is what makes the
 * cursor stable — without it, ties can be re-shuffled between pages and an
 * entry gets skipped or served twice.
 */
export async function getActivitiesQuery(data: WithUserId<GetActivityArgs>) {
  const where = { cardId: data.cardId, userId: data.userId };

  const list = prisma.activity.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: ACTIVITY_PAGE_SIZE,
    ...(data.cursor ? { cursor: { id: data.cursor }, skip: 1 } : {}),
  });

  // The panel pins the card's oldest entry — the one recording its creation —
  // to the bottom of the list in every view, so it has to arrive before the
  // pages have been scrolled all the way back to it. Only the first page
  // carries it; later pages inherit it from the cache.
  const initialEntry = data.cursor
    ? null
    : prisma.activity.findFirst({
        where,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      });

  const [items, firstEntry] = await Promise.all([list, initialEntry]);

  const lastItem = items[items.length - 1];

  return {
    items,
    firstEntry,
    nextCursor: items.length === ACTIVITY_PAGE_SIZE ? lastItem.id : null,
  };
}

export async function createActivityQuery(
  data: WithUserId<CreateActivityArgs>,
) {
  const board = await prisma.stack.findFirst({
    where: { id: data.boardId, userId: data.userId },
  });

  if (!board) {
    throw new Error('Forbidden');
  }

  const result = await prisma.activity.create({
    data: {
      ...data,
      userId: data.userId,
    },
  });

  return result;
}

export function updateActivityQuery(data: WithUserId<UpdateActivityArgs>) {
  return prisma.activity.updateMany({
    where: {
      id: data.activityId,
      userId: data.userId,
    },
    data: {
      content: data.content,
    },
  });
}

export function deleteActivityQuery(data: WithUserId<DeleteActivityArgs>) {
  return prisma.activity.delete({
    where: {
      id: data.activityId,
      userId: data.userId,
    },
  });
}
