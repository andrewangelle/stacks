import { faker } from '@faker-js/faker';
import { buildE2EUser } from '~test/factories/user';
import { getStore, id, now } from '~test/mocks/memoryPrisma';

export function resetDB(seed = 42) {
  faker.seed(seed);
  getStore();
  getStore().clerkUser = null;
  getStore().users = [];
  getStore().profiles = [];
  getStore().stacks = [];
  getStore().lists = [];
  getStore().cards = [];
  getStore().checklists = [];
  getStore().checklistItems = [];
  getStore().activities = [];
  seedUser();
}

function seedUser() {
  const { clerkUser, user, profile } = buildE2EUser();
  const timestamp = now();

  getStore().clerkUser = clerkUser;

  getStore().users.push({
    ...user,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  getStore().profiles.push({
    id: id(),
    ...profile,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}
