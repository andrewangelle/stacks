import { getBoardUserId, listBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ListRecord = {
  id: string;
  listTitle: string;
  boardId: string;
  userId: string;
} & Timestamps;

export const listModel = {
  async findMany(args: {
    where: {
      boardId: string;
      board: { userId: string };
    };
    orderBy: { createdAt: 'asc' };
  }) {
    return sortByCreatedAt(
      getStore().lists.filter(
        (list) =>
          list.boardId === args.where.boardId &&
          getBoardUserId(list.boardId) === args.where.board.userId,
      ),
    );
  },

  async findFirst(args: {
    where:
      | { id: string; userId: string }
      | { id: string; board: { userId: string } }
      | { id: string; userId: string; board: { userId: string } };
  }) {
    const where = args.where;

    if ('userId' in where && !('board' in where)) {
      return (
        getStore().lists.find(
          (list) => list.id === where.id && list.userId === where.userId,
        ) ?? null
      );
    }

    if ('board' in where) {
      const userId = where.board.userId;
      return (
        getStore().lists.find(
          (list) => list.id === where.id && listBelongsToUser(list, userId),
        ) ?? null
      );
    }

    return null;
  },

  async create(args: {
    data: { listTitle: string; boardId: string; userId: string };
  }) {
    const timestamp = now();

    const created: ListRecord = {
      id: id(),
      listTitle: args.data.listTitle,
      boardId: args.data.boardId,
      userId: args.data.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().lists.push(created);

    return created;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: { listTitle: string };
  }) {
    const list = getStore().lists.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!list) {
      return { count: 0 };
    }

    list.listTitle = args.data.listTitle;
    list.updatedAt = now();
    return { count: 1 };
  },

  async delete(args: { where: { id: string } }) {
    const index = getStore().lists.findIndex(
      (list) => list.id === args.where.id,
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    const [removed] = getStore().lists.splice(index, 1);

    getStore().cards = getStore().cards.filter(
      (card) => card.listId !== removed.id,
    );

    return removed;
  },
};
