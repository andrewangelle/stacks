import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByPosition,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type ChecklistRecord = {
  id: string;
  checklistTitle: string;
  hideCheckedItems: boolean;
  cardId: string;
  listId: string;
  userId: string;
  position: number;
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

/**
 * Faithfully mirrors the `select` shapes Prisma is called with across the app.
 * `items` can be requested three ways, each of which real Prisma supports:
 *   - `true`                          → full item records
 *   - `{ where }`                     → filtered full item records
 *   - `{ where, select }`             → filtered, field-projected items
 */
type ChecklistItemSelect =
  | true
  | {
      where?: { cardId?: string; checklistId?: string };
      select?: { label?: boolean; isCompleted?: boolean };
    };

type ChecklistSelect = {
  id?: boolean;
  checklistTitle?: boolean;
  createdAt?: boolean;
  cardId?: boolean;
  listId?: boolean;
  userId?: boolean;
  position?: boolean;
  hideCheckedItems?: boolean;
  items?: ChecklistItemSelect;
};

function projectChecklistItems(
  checklistId: string,
  itemsSelect: ChecklistItemSelect,
) {
  let items = getStore().checklistItems.filter(
    (item) => item.checklistId === checklistId,
  );

  const where = itemsSelect === true ? undefined : itemsSelect.where;

  if (where?.cardId) {
    items = items.filter((item) => item.cardId === where.cardId);
  }

  if (where?.checklistId) {
    items = items.filter((item) => item.checklistId === where.checklistId);
  }

  items = sortByPosition(items);

  const fieldSelect = itemsSelect === true ? undefined : itemsSelect.select;

  if (!fieldSelect) {
    return items.map((item) => ({ ...item }));
  }

  return items.map((item) => {
    const projected: Record<string, unknown> = {};
    if (fieldSelect.label) projected.label = item.label;
    if (fieldSelect.isCompleted) projected.isCompleted = item.isCompleted;
    return projected;
  });
}

function projectChecklist(checklist: ChecklistRecord, select: ChecklistSelect) {
  const result: Record<string, unknown> = {};

  if (select.id) result.id = checklist.id;
  if (select.checklistTitle) result.checklistTitle = checklist.checklistTitle;
  if (select.createdAt) result.createdAt = checklist.createdAt;
  if (select.cardId) result.cardId = checklist.cardId;
  if (select.listId) result.listId = checklist.listId;
  if (select.userId) result.userId = checklist.userId;
  if (select.position) result.position = checklist.position;
  if (select.hideCheckedItems) {
    result.hideCheckedItems = checklist.hideCheckedItems;
  }
  if (select.items) {
    result.items = projectChecklistItems(checklist.id, select.items);
  }

  return result;
}

function projectChecklists(
  checklists: ChecklistRecord[],
  select: ChecklistSelect,
) {
  return checklists.map((checklist) => projectChecklist(checklist, select));
}

export const checklistModel = {
  async findMany(args: {
    where: {
      cardId?: string;
      card?: { list: { board: { userId: string } } };
      items?: { some: { cardId: string } };
    };
    orderBy?:
      | { createdAt: 'asc' }
      | [{ position: 'asc' }, { createdAt: 'asc' }];
    select?: ChecklistSelect;
  }) {
    const checklists = sortByPosition(filterChecklists(args.where));

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
    select?: ChecklistSelect;
  }) {
    const match = filterChecklists(args.where)[0] ?? null;

    if (!match) {
      return null;
    }

    return args.select ? projectChecklist(match, args.select) : match;
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
    const position = getStore().checklists.filter(
      (checklist) => checklist.cardId === args.data.cardId,
    ).length;

    const created: ChecklistRecord = {
      id: id(),
      checklistTitle: args.data.checklistTitle,
      hideCheckedItems: false,
      cardId: args.data.cardId,
      listId: args.data.listId,
      userId: args.data.userId,
      position,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().checklists.push(created);

    return created;
  },

  async update(args: {
    where: { id: string; userId: string };
    data: { checklistTitle?: string; hideCheckedItems?: boolean };
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

    if (args.data.hideCheckedItems !== undefined) {
      checklist.hideCheckedItems = args.data.hideCheckedItems;
    }

    checklist.updatedAt = now();

    return checklist;
  },

  async updateMany(args: {
    where: { id: string; userId: string };
    data: {
      checklistTitle?: string;
      hideCheckedItems?: boolean;
      position?: number;
    };
  }) {
    const checklist = getStore().checklists.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!checklist) {
      return { count: 0 };
    }

    if (args.data.checklistTitle !== undefined) {
      checklist.checklistTitle = args.data.checklistTitle;
    }

    if (args.data.hideCheckedItems !== undefined) {
      checklist.hideCheckedItems = args.data.hideCheckedItems;
    }

    if (args.data.position !== undefined) {
      checklist.position = args.data.position;
    }

    checklist.updatedAt = now();
    return { count: 1 };
  },

  async count(args: {
    where: {
      cardId: string;
      card?: { list: { board: { userId: string } } };
    };
  }) {
    return filterChecklists(args.where).length;
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

    // Mirror the `expandedChecklistId` FK's onDelete: SetNull.
    for (const card of getStore().cards) {
      if (card.expandedChecklistId === removed.id) {
        card.expandedChecklistId = null;
      }
    }

    return removed;
  },
};
