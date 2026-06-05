import { createMiddleware } from '@tanstack/react-start';
import { TEST_USER_ID } from '~test/mocks/constants';
import { getStore } from '~test/mocks/memoryPrisma';

export function clerkMiddleware() {
  return createMiddleware().server(async ({ next }) => next());
}

export async function auth() {
  return {
    isAuthenticated: true,
    userId: TEST_USER_ID,
  };
}

export function clerkClient() {
  return {
    users: {
      getUser: async () => getE2EClerkUser(),
    },
  };
}

function getE2EClerkUser() {
  const clerkUser = getStore().clerkUser;

  if (!clerkUser) {
    throw new Error('E2E user not seeded — call resetMemoryDb() first');
  }

  return clerkUser;
}
