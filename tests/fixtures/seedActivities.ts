import { prisma } from '~/db/prisma';
import { TEST_USER_ID } from '~test/mocks/constants';

export async function seedActivities(data: {
  boardId: string;
  listId: string;
  cardId: string;
  count: number;
  type?: string;
}) {
  const now = Date.now();

  // Stagger createdAt a minute apart so the newest-first pagination order is
  // deterministic: entry 1 is the newest, entry `count` the oldest.
  await prisma.activity.createMany({
    data: Array.from({ length: data.count }, (_, index) => ({
      content: `seeded activity ${index + 1}`,
      type: data.type ?? 'comment',
      listId: data.listId,
      cardId: data.cardId,
      boardId: data.boardId,
      userId: TEST_USER_ID,
      createdAt: new Date(now - (index + 1) * 60_000),
    })),
  });

  // Hand back the rows in the order the activity feed serves them, so a test
  // can address "the entry on page three" by index.
  return prisma.activity.findMany({
    where: { cardId: data.cardId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}
