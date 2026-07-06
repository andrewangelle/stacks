import { getBoardUserId, listBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByPosition,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ListRecord = {
  id: string;
  listTitle: string;
  boardId: string;
  userId: string;
  position: number;
} & Timestamps;

export const listModel = {
  async findMany(args: {
    where:
      | {
          boardId: string;
          board: { userId: string };
        }
      | {
          id: string;
        };
    orderBy?:
      | { createdAt: 'asc' }
      | [{ position: 'asc' }, { createdAt: 'asc' }];
    select?: {
      id?: boolean;
      listTitle?: boolean;
      createdAt?: boolean;
      position?: boolean;
      boardId?: boolean;
      cards?: {
        select?: {
          id?: boolean;
          cardTitle?: boolean;
          createdAt?: boolean;
        };
      };
    };
  }) {
    const where = args.where;
    const lists =
      'boardId' in where
        ? getStore().lists.filter(
            (list) =>
              list.boardId === where.boardId &&
              getBoardUserId(list.boardId) === where.board.userId,
          )
        : getStore().lists.filter((list) => list.id === where.id);

    const sortedLists =
      args.orderBy && Array.isArray(args.orderBy)
        ? sortByPosition(lists)
        : lists;

    if (!args.select) {
      return sortedLists;
    }

    return sortedLists.map((list) => {
      const cards = getStore()
        .cards.filter((card) => card.listId === list.id)
        .sort((a, b) => {
          if (a.position !== b.position) {
            return a.position - b.position;
          }
          return a.createdAt.getTime() - b.createdAt.getTime();
        })
        .map((card) => ({
          id: card.id,
          cardTitle: card.cardTitle,
          createdAt: card.createdAt,
        }));

      return {
        ...(args.select?.id ? { id: list.id } : {}),
        ...(args.select?.listTitle ? { listTitle: list.listTitle } : {}),
        ...(args.select?.createdAt ? { createdAt: list.createdAt } : {}),
        ...(args.select?.position ? { position: list.position } : {}),
        ...(args.select?.boardId ? { boardId: list.boardId } : {}),
        ...(args.select?.cards ? { cards } : {}),
      };
    });
  },

  async findFirst(args: {
    where:
      | { id: string; userId: string }
      | { id: string; board: { userId: string } }
      | { id: string; userId: string; board: { userId: string } }
      | { id: string; boardId: string; board: { userId: string } };
  }) {
    const where = args.where;

    if ('boardId' in where && 'board' in where) {
      const userId = where.board.userId;
      return (
        getStore().lists.find(
          (list) =>
            list.id === where.id &&
            list.boardId === where.boardId &&
            listBelongsToUser(list, userId),
        ) ?? null
      );
    }

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
    data: {
      listTitle: string;
      boardId: string;
      userId: string;
      position?: number;
    };
  }) {
    const timestamp = now();
    const position =
      args.data.position ??
      getStore().lists.filter((list) => list.boardId === args.data.boardId)
        .length;

    const created: ListRecord = {
      id: id(),
      listTitle: args.data.listTitle,
      boardId: args.data.boardId,
      userId: args.data.userId,
      position,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().lists.push(created);

    return created;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: { listTitle?: string; position?: number };
  }) {
    const list = getStore().lists.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!list) {
      return { count: 0 };
    }

    if (args.data.listTitle !== undefined) {
      list.listTitle = args.data.listTitle;
    }

    if (args.data.position !== undefined) {
      list.position = args.data.position;
    }

    list.updatedAt = now();
    return { count: 1 };
  },

  async count(args: { where: { boardId: string; board: { userId: string } } }) {
    return getStore().lists.filter(
      (list) =>
        list.boardId === args.where.boardId &&
        getBoardUserId(list.boardId) === args.where.board.userId,
    ).length;
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
