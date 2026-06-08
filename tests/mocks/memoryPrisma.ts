import type { User } from '@clerk/tanstack-react-start/server';
import type { PrismaClient } from '~/generated/prisma/client';
import { type CardRecord, cardModel } from '~test/mocks/db/card';
import { type ChecklistRecord, checklistModel } from '~test/mocks/db/checklist';
import {
  type ChecklistItemRecord,
  checklistItemModel,
} from '~test/mocks/db/checklistItem';
import { type ListRecord, listModel } from '~test/mocks/db/list';
import { type ProfileRecord, profileModel } from '~test/mocks/db/profile';
import { type StackRecord, stackModel } from '~test/mocks/db/stack';
import { type UserRecord, userModel } from '~test/mocks/db/user';

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type E2EStore = {
  clerkUser: User | null;
  users: UserRecord[];
  profiles: ProfileRecord[];
  stacks: StackRecord[];
  lists: ListRecord[];
  cards: CardRecord[];
  checklists: ChecklistRecord[];
  checklistItems: ChecklistItemRecord[];
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
      profiles: [],
      stacks: [],
      lists: [],
      cards: [],
      checklists: [],
      checklistItems: [],
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

export const prisma = {
  user: userModel,
  profile: profileModel,
  stack: stackModel,
  list: listModel,
  card: cardModel,
  checklist: checklistModel,
  checklistItem: checklistItemModel,
} as unknown as PrismaClient;
