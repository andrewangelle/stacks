import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ActivityRecord = {
  id: string;
  content: string;
  type: string;
  listId: string;
  cardId: string;
  boardId: string;
  userId: string;
} & Timestamps;

export const activityModel = {
  async findMany(args: {
    where: {
      cardId: string;
      card: { list: { board: { userId: string } } };
    };
    orderBy: { createdAt: 'asc' };
  }) {
    const userId = args.where.card.list.board.userId;

    return sortByCreatedAt(
      getStore().activities.filter((activity) => {
        const cardInStore = getStore().cards.find(
          (card) => card.id === activity.cardId,
        );
        return (
          activity.cardId === args.where.cardId &&
          cardInStore &&
          cardBelongsToUser(cardInStore, userId)
        );
      }),
    );
  },

  async create(args: {
    data: {
      content: string;
      type: string;
      listId: string;
      cardId: string;
      boardId: string;
      userId: string;
    };
  }) {
    const timestamp = now();

    const created: ActivityRecord = {
      id: id(),
      ...args.data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().activities.push(created);

    return created;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: { content: string };
  }) {
    const activity = getStore().activities.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!activity) {
      return { count: 0 };
    }

    activity.content = args.data.content;
    activity.updatedAt = now();

    return { count: 1 };
  },

  async delete(args: { where: { id: string } }) {
    const index = getStore().activities.findIndex(
      (activity) => activity.id === args.where.id,
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    const [removed] = getStore().activities.splice(index, 1);

    return removed;
  },
};
