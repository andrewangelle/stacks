import { createMiddleware } from '@tanstack/react-start';
import { TEST_CLERK_USER, TEST_USER_ID } from '~test/mocks/constants';

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
      getUser: async () => TEST_CLERK_USER,
    },
  };
}
