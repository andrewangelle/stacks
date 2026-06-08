import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ChecklistItemRecord = {
  id: string;
  label: string;
  isCompleted: boolean;
  cardId: string;
  checklistId: string;
  listId: string;
  userId: string;
} & Timestamps;

function checklistItemBelongsToUser(item: ChecklistItemRecord, userId: string) {
  const card = getStore().cards.find((record) => record.id === item.cardId);
  return card ? cardBelongsToUser(card, userId) : false;
}

export const checklistItemModel = {
  async findMany(args: {
    where: {
      checklistId: string;
      checklist: { card: { list: { board: { userId: string } } } };
      id?: string;
    };
    orderBy: { createdAt: 'asc' };
  }) {
    if ('id' in args.where) {
      const item = getStore().checklistItems.find(
        (record) => record.id === args.where.id,
      );
      return item ? [item] : [];
    }

    const userId = args.where.checklist.card.list.board.userId;

    return sortByCreatedAt(
      getStore().checklistItems.filter(
        (item) =>
          item.checklistId === args.where.checklistId &&
          checklistItemBelongsToUser(item, userId),
      ),
    );
  },

  async findFirst(args: { where: { id: string; userId: string } }) {
    return (
      getStore().checklistItems.find(
        (item) =>
          item.id === args.where.id && item.userId === args.where.userId,
      ) ?? null
    );
  },

  async create(args: {
    data: {
      label: string;
      cardId: string;
      checklistId: string;
      listId: string;
      userId: string;
      isCompleted: boolean;
    };
  }) {
    const timestamp = now();

    const created: ChecklistItemRecord = {
      id: id(),
      label: args.data.label,
      isCompleted: args.data.isCompleted,
      cardId: args.data.cardId,
      checklistId: args.data.checklistId,
      listId: args.data.listId,
      userId: args.data.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().checklistItems.push(created);

    return created;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: { label?: string; isCompleted?: boolean };
  }) {
    const item = getStore().checklistItems.find(
      (record) =>
        record.id === args.where.id && record.userId === args.where.userId,
    );

    if (!item) {
      return { count: 0 };
    }

    if (args.data.label !== undefined) {
      item.label = args.data.label;
    }

    if (args.data.isCompleted !== undefined) {
      item.isCompleted = args.data.isCompleted;
    }

    item.updatedAt = now();

    return { count: 1 };
  },

  async delete(args: { where: { id: string } }) {
    const index = getStore().checklistItems.findIndex(
      (item) => item.id === args.where.id,
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    const [removed] = getStore().checklistItems.splice(index, 1);

    return removed;
  },
};
