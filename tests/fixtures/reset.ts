import { faker } from '@faker-js/faker';
import { prisma } from '~/db/prisma';
import { TEST_USER_EMAIL, TEST_USER_ID } from '~test/mocks/constants';

export async function resetDB(seed = 42) {
  faker.seed(seed);

  // Delete children before parents so the FK constraints are satisfied without
  // relying on cascade ordering.
  await prisma.$transaction([
    prisma.activity.deleteMany(),
    prisma.checklistItem.deleteMany(),
    prisma.checklist.deleteMany(),
    prisma.card.deleteMany(),
    prisma.list.deleteMany(),
    prisma.stack.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  await prisma.user.create({
    data: { id: TEST_USER_ID, email: TEST_USER_EMAIL },
  });
}
