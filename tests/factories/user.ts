import type { User } from '@clerk/tanstack-react-start/server';
import { faker } from '@faker-js/faker';
import { TEST_USER_ID } from '~test/mocks/constants';

export function buildE2EUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  const clerkUser = {
    id: TEST_USER_ID,
    firstName,
    lastName,
    emailAddresses: [{ emailAddress: email }],
  } as User;

  return {
    clerkUser,
    user: { id: TEST_USER_ID, email },
  };
}
