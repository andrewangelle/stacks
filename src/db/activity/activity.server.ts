import type {
  CreateActivityArgs,
  DeleteActivityArgs,
  GetActivityArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import { prisma } from '~/db/prisma';
import type { WithUserId } from '~/db/withUserId';

export function getActivityQuery(data: WithUserId<GetActivityArgs>) {
  return prisma.activity.findMany({
    where: {
      cardId: data.cardId,
      card: { list: { board: { userId: data.userId } } },
    },
    orderBy: { createdAt: 'asc' },
  });
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
