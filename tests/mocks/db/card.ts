import { cardBelongsToUser } from '~test/mocks/db/user';
import {
  getStore,
  id,
  now,
  sortByPosition,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type CardRecord = {
  id: string;
  cardTitle: string;
  cardDescription: string;
  listId: string;
  userId: string;
  position: number;
  isCompleted: boolean;
} & Timestamps;

// Mirrors the subset of Prisma's string filters the card queries rely on. The
// `startsWith` form backs lookups by the truncated 8-char id used in copied
// activity links.
type CardIdFilter = string | { startsWith: string };

function matchesCardId(cardId: string, filter: CardIdFilter) {
  if (typeof filter === 'string') {
    return cardId === filter;
  }

  return cardId.startsWith(filter.startsWith);
}

export const cardModel = {
  async findMany(args: {
    where: {
      listId: string;
      list: { board: { userId: string } };
      id?: string;
    };
    orderBy: { createdAt: 'asc' } | [{ position: 'asc' }, { createdAt: 'asc' }];
  }) {
    if ('id' in args.where) {
      const card = getStore().cards.find((item) => item.id === args.where.id);
      return card ? [card] : [];
    }

    const userId = args.where.list.board.userId;

    return sortByPosition(
      getStore().cards.filter(
        (card) =>
          card.listId === args.where.listId && cardBelongsToUser(card, userId),
      ),
    );
  },

  async findFirst(args: {
    where:
      | { id: CardIdFilter; userId: string }
      | { id: CardIdFilter; list: { board: { userId: string } } };
    select?: {
      id?: boolean;
      list?: {
        select?: {
          boardId?: boolean;
          board?: { select?: { boardColor?: boolean } };
        };
      };
    };
  }) {
    const where = args.where;

    const match =
      'userId' in where
        ? getStore().cards.find(
            (card) =>
              matchesCardId(card.id, where.id) && card.userId === where.userId,
          )
        : getStore().cards.find(
            (card) =>
              matchesCardId(card.id, where.id) &&
              cardBelongsToUser(card, where.list.board.userId),
          );

    if (!match) {
      return null;
    }

    // Honor the nested `select` used by getBoardIdByCardIdQuery, which reads
    // `card.list.boardId`. The lists store maps the card's listId to a boardId.
    if (args.select?.list) {
      const list = getStore().lists.find((item) => item.id === match.listId);
      const board = getStore().stacks.find((item) => item.id === list?.boardId);
      return {
        id: match.id,
        list: {
          boardId: list?.boardId,
          board: { boardColor: board?.boardColor },
        },
      };
    }

    return match;
  },

  async create(args: {
    data: {
      cardTitle: string;
      listId: string;
      userId: string;
      position?: number;
    };
  }) {
    const timestamp = now();
    const position =
      args.data.position ??
      getStore().cards.filter((card) => card.listId === args.data.listId)
        .length;

    const created: CardRecord = {
      id: id(),
      cardTitle: args.data.cardTitle,
      cardDescription: '',
      listId: args.data.listId,
      userId: args.data.userId,
      position,
      isCompleted: false,
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
      listId?: string;
      position?: number;
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

    if (args.data.isCompleted !== undefined) {
      card.isCompleted = args.data.isCompleted;
    }

    if (args.data.listId !== undefined) {
      card.listId = args.data.listId;
    }

    if (args.data.position !== undefined) {
      card.position = args.data.position;
    }

    card.updatedAt = now();

    return { count: 1 };
  },

  async count(args: {
    where: {
      listId: string;
      list: { board: { userId: string } };
    };
  }) {
    const userId = args.where.list.board.userId;

    return getStore().cards.filter(
      (card) =>
        card.listId === args.where.listId && cardBelongsToUser(card, userId),
    ).length;
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
