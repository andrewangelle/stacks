import {
  getStore,
  id,
  now,
  sortByCreatedAt,
  type Timestamps,
} from '~test/mocks/memoryPrisma';

export type StackRecord = {
  id: string;
  boardTitle: string;
  boardColor: string;
  userId: string;
} & Timestamps;

export const stackModel = {
  async findMany(args: {
    where: { userId: string };
    orderBy: { createdAt: 'asc' };
  }) {
    return sortByCreatedAt(
      getStore().stacks.filter((stack) => stack.userId === args.where.userId),
    );
  },

  async findFirst(args: {
    where: { id: string | { startsWith: string }; userId: string };
  }) {
    const { id, userId } = args.where;

    return (
      getStore().stacks.find(
        (stack) =>
          stack.userId === userId &&
          (typeof id === 'string'
            ? stack.id === id
            : stack.id.startsWith(id.startsWith)),
      ) ?? null
    );
  },

  async create(args: {
    data: {
      userId: string;
      boardTitle: string;
      boardColor: string;
    };
  }) {
    const timestamp = now();

    const created: StackRecord = {
      id: id(),
      boardTitle: args.data.boardTitle,
      boardColor: args.data.boardColor,
      userId: args.data.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().stacks.push(created);

    return created;
  },

  async update(args: {
    where: { id: string; userId: string };
    data: { boardTitle: string; boardColor: string };
  }) {
    const stack = getStore().stacks.find(
      (item) => item.id === args.where.id && item.userId === args.where.userId,
    );

    if (!stack) {
      throw new Error('Record not found');
    }

    stack.boardTitle = args.data.boardTitle;
    stack.boardColor = args.data.boardColor;
    stack.updatedAt = now();

    return stack;
  },
};
