import type { User } from '@clerk/tanstack-react-start/server';
import type { PrismaClient } from '~/generated/prisma/client';
import { type ActivityRecord, activityModel } from '~test/mocks/db/activity';
import { type CardRecord, cardModel } from '~test/mocks/db/card';
import { type ChecklistRecord, checklistModel } from '~test/mocks/db/checklist';
import {
  type ChecklistItemRecord,
  checklistItemModel,
} from '~test/mocks/db/checklistItem';
import { type ListRecord, listModel } from '~test/mocks/db/list';
import { type StackRecord, stackModel } from '~test/mocks/db/stack';
import { type UserRecord, userModel } from '~test/mocks/db/user';

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type E2EStore = {
  clerkUser: User | null;
  users: UserRecord[];
  stacks: StackRecord[];
  lists: ListRecord[];
  cards: CardRecord[];
  checklists: ChecklistRecord[];
  checklistItems: ChecklistItemRecord[];
  activities: ActivityRecord[];
};

declare global {
  // Vite can load this module twice (middleware vs SSR bundle); one shared store.
  var __stacksE2EStore: E2EStore | undefined;
}

export function getStore(): E2EStore {
  if (!globalThis.__stacksE2EStore) {
    globalThis.__stacksE2EStore = {
      clerkUser: null,
      users: [],
      stacks: [],
      lists: [],
      cards: [],
      checklists: [],
      checklistItems: [],
      activities: [],
    };
  }
  return globalThis.__stacksE2EStore;
}

export function now() {
  return new Date();
}

export function id() {
  return crypto.randomUUID();
}

export function sortByCreatedAt<T extends { createdAt: Date }>(items: T[]) {
  return [...items].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
}

export function sortByPosition<T extends { position: number; createdAt: Date }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }

    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

export const prisma = {
  user: userModel,
  stack: stackModel,
  list: listModel,
  card: cardModel,
  checklist: checklistModel,
  checklistItem: checklistItemModel,
  activity: activityModel,
  $transaction: async <T>(
    arg: Promise<T>[] | ((client: PrismaClient) => Promise<T>),
  ) => {
    if (typeof arg === 'function') {
      return arg(prisma as PrismaClient);
    }

    return Promise.all(arg);
  },
} as unknown as PrismaClient;
