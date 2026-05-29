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
      listId: data.listId,
      cardId: data.cardId,
      boardId: data.boardId,
      userId: data.userId,
      content: data.content,
      type: data.type,
    },
  });

  /** @todo: log this */
  // return {
  //   code: 'activity:create:success',
  //   message: 'success',
  //   data: [result],
  // };

  return result;
}

export async function updateActivityQuery(
  data: WithUserId<UpdateActivityArgs>,
) {
  await prisma.activity.updateMany({
    where: {
      id: data.activityId,
      userId: data.userId,
    },
    data: {
      content: data.content,
    },
  });

  return prisma.activity.findMany({
    where: { id: data.activityId },
  });
}

export async function deleteActivityQuery(
  data: WithUserId<DeleteActivityArgs>,
) {
  const result = await prisma.activity.findFirst({
    where: {
      id: data.activityId,
      userId: data.userId,
    },
  });

  if (!result) {
    throw new Error('Activity Not found');
  }

  await prisma.activity.delete({
    where: { id: result.id },
  });

  return {
    code: 'activity:delete:success',
    message: 'success',
    data: [result],
  };
}
