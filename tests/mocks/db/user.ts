import type { CardRecord } from '~test/mocks/db/card';
import type { ListRecord } from '~test/mocks/db/list';
import { getStore, now, type Timestamps } from '~test/mocks/memoryPrisma';

export type UserRecord = { id: string; email: string } & Timestamps;

export function listBelongsToUser(list: ListRecord, userId: string) {
  return list.userId === userId && getBoardUserId(list.boardId) === userId;
}

export function cardBelongsToUser(card: CardRecord, userId: string) {
  const list = getStore().lists.find((item) => item.id === card.listId);
  return list ? listBelongsToUser(list, userId) : false;
}

export function getBoardUserId(boardId: string) {
  return getStore().stacks.find((stack) => stack.id === boardId)?.userId;
}

export const userModel = {
  async upsert(args: {
    where: { id: string };
    create: { id: string; email: string };
    update: { email: string };
  }) {
    const existing = getStore().users.find((user) => user.id === args.where.id);

    const timestamp = now();

    if (existing) {
      existing.email = args.update.email;
      existing.updatedAt = timestamp;
      return existing;
    }

    const created: UserRecord = {
      id: args.create.id,
      email: args.create.email,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().users.push(created);

    return created;
  },
};
