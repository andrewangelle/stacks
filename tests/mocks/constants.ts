import type { User } from '@clerk/tanstack-react-start/server';

export const TEST_USER_ID = 'e2e-test-user';
export const TEST_USER_EMAIL = 'e2e-test-user@example.com';

export const TEST_CLERK_USER = {
  id: TEST_USER_ID,
  firstName: 'E2E',
  lastName: 'Tester',
  emailAddresses: [{ emailAddress: TEST_USER_EMAIL }],
} as User;
