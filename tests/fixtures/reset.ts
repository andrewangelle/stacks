import { faker } from '@faker-js/faker';
import { buildE2EUser } from '~test/factories/user';
import { getStore, now } from '~test/mocks/memoryPrisma';

export function resetDB(seed = 42) {
  faker.seed(seed);
  getStore();
  getStore().clerkUser = null;
  getStore().users = [];
  getStore().stacks = [];
  getStore().lists = [];
  getStore().cards = [];
  getStore().checklists = [];
  getStore().checklistItems = [];
  getStore().activities = [];
  seedUser();
}

function seedUser() {
  const { clerkUser, user } = buildE2EUser();
  const timestamp = now();

  getStore().clerkUser = clerkUser;

  getStore().users.push({
    ...user,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}
