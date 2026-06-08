import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ChecklistRecord = {
  id: string;
  checklistTitle: string;
  cardId: string;
  listId: string;
  userId: string;
} & Timestamps;

function checklistBelongsToUser(checklist: ChecklistRecord, userId: string) {
  const card = getStore().cards.find((item) => item.id === checklist.cardId);
  return card ? cardBelongsToUser(card, userId) : false;
}

function filterChecklists(where: {
  cardId?: string;
  id?: string;
  userId?: string;
  card?: { list: { board: { userId: string } } };
  items?: { some: { cardId: string } };
}) {
  const userId = where.userId ?? where.card?.list?.board?.userId;

  return getStore().checklists.filter((checklist) => {
    if (where.id && checklist.id !== where.id) return false;
    if (where.cardId && checklist.cardId !== where.cardId) return false;
    if (where.userId && checklist.userId !== where.userId) return false;
    if (userId && !checklistBelongsToUser(checklist, userId)) return false;
    if (where.items?.some?.cardId) {
      const hasItem = getStore().checklistItems.some(
        (item) =>
          item.checklistId === checklist.id &&
          item.cardId === where.items?.some.cardId,
      );
      if (!hasItem) return false;
    }
    return true;
  });
}

function projectChecklists(
  checklists: ChecklistRecord[],
  select: {
    id?: boolean;
    checklistTitle?: boolean;
    items?: {
      where?: { cardId: string };
      select: { label?: boolean; isCompleted?: boolean };
    };
  },
) {
  return checklists.map((checklist) => {
    const result: Record<string, unknown> = {};

    if (select.id) result.id = checklist.id;
    if (select.checklistTitle) result.checklistTitle = checklist.checklistTitle;

    if (select.items) {
      let items = getStore().checklistItems.filter(
        (item) => item.checklistId === checklist.id,
      );

      if (select.items.where?.cardId) {
        items = items.filter(
          (item) => item.cardId === select.items?.where?.cardId,
        );
      }

      result.items = items.map((item) => {
        const projected: Record<string, unknown> = {};
        if (select.items?.select.label) projected.label = item.label;
        if (select.items?.select.isCompleted) {
          projected.isCompleted = item.isCompleted;
        }
        return projected;
      });
    }

    return result;
  });
}

export const checklistModel = {
  async findMany(args: {
    where: {
      cardId?: string;
      card?: { list: { board: { userId: string } } };
      items?: { some: { cardId: string } };
    };
    orderBy?: { createdAt: 'asc' };
    select?: {
      id?: boolean;
      checklistTitle?: boolean;
      items?: {
        where?: { cardId: string };
        select: { label?: boolean; isCompleted?: boolean };
      };
    };
  }) {
    const checklists = sortByCreatedAt(filterChecklists(args.where));

    if (args.select) {
      return projectChecklists(checklists, args.select);
    }

    return checklists;
  },

  async findFirst(args: {
    where: {
      id: string;
      userId?: string;
      cardId?: string;
      listId?: string;
    };
  }) {
    const matches = filterChecklists(args.where);
    return matches[0] ?? null;
  },

  async create(args: {
    data: {
      checklistTitle: string;
      cardId: string;
      listId: string;
      userId: string;
    };
  }) {
    const timestamp = now();

    const created: ChecklistRecord = {
      id: id(),
      checklistTitle: args.data.checklistTitle,
      cardId: args.data.cardId,
      listId: args.data.listId,
      userId: args.data.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().checklists.push(created);

    return created;
  },

  async update(args: {
    where: { id: string; userId: string };
    data: { checklistTitle?: string };
  }) {
    const checklist = getStore().checklists.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!checklist) {
      throw new Error('Record not found');
    }

    if (args.data.checklistTitle !== undefined) {
      checklist.checklistTitle = args.data.checklistTitle;
    }

    checklist.updatedAt = now();

    return checklist;
  },

  async delete(args: { where: { id: string } }) {
    const index = getStore().checklists.findIndex(
      (checklist) => checklist.id === args.where.id,
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    const [removed] = getStore().checklists.splice(index, 1);

    getStore().checklistItems = getStore().checklistItems.filter(
      (item) => item.checklistId !== removed.id,
    );

    return removed;
  },
};
