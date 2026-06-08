import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type CardRecord = {
  id: string;
  cardTitle: string;
  cardDescription: string;
  listId: string;
  userId: string;
} & Timestamps;

export const cardModel = {
  async findMany(args: {
    where: {
      listId: string;
      list: { board: { userId: string } };
      id?: string;
    };
    orderBy: { createdAt: 'asc' };
  }) {
    if ('id' in args.where) {
      const card = getStore().cards.find((item) => item.id === args.where.id);
      return card ? [card] : [];
    }

    const userId = args.where.list.board.userId;

    return sortByCreatedAt(
      getStore().cards.filter(
        (card) =>
          card.listId === args.where.listId && cardBelongsToUser(card, userId),
      ),
    );
  },

  async findFirst(args: {
    where:
      | { id: string; userId: string }
      | { id: string; list: { board: { userId: string } } };
  }) {
    const where = args.where;

    if ('userId' in where) {
      return (
        getStore().cards.find(
          (card) => card.id === where.id && card.userId === where.userId,
        ) ?? null
      );
    }

    const userId = where.list.board.userId;

    return (
      getStore().cards.find(
        (card) => card.id === where.id && cardBelongsToUser(card, userId),
      ) ?? null
    );
  },

  async create(args: {
    data: { cardTitle: string; listId: string; userId: string };
  }) {
    const timestamp = now();

    const created: CardRecord = {
      id: id(),
      cardTitle: args.data.cardTitle,
      cardDescription: '',
      listId: args.data.listId,
      userId: args.data.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().cards.push(created);

    return created;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: {
      cardDescription?: string;
      cardTitle?: string;
      isCompleted?: boolean;
    };
  }) {
    const card = getStore().cards.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!card) {
      return { count: 0 };
    }

    if (args.data.cardDescription !== undefined) {
      card.cardDescription = args.data.cardDescription;
    }

    if (args.data.cardTitle !== undefined) {
      card.cardTitle = args.data.cardTitle;
    }

    card.updatedAt = now();

    return { count: 1 };
  },

  async delete(args: { where: { id: string } }) {
    const index = getStore().cards.findIndex(
      (card) => card.id === args.where.id,
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    const [removed] = getStore().cards.splice(index, 1);

    return removed;
  },
};
