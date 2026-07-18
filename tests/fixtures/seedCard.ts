import { prisma } from '~/db/prisma';
import { buildCard } from '~test/factories/card';
import { buildList } from '~test/factories/list';
import { TEST_USER_ID } from '~test/mocks/constants';

export async function seedCard(data: {
  boardId: string;
  listId?: string;
  listTitle?: string;
  cardTitle?: string;
}) {
  const { cardTitle } = buildCard(data.cardTitle);

  // Append to an existing list when given a listId, so a list can hold several
  // cards; otherwise create a fresh list for this card.
  const list = data.listId
    ? await prisma.list.findUnique({ where: { id: data.listId } })
    : await prisma.list.create({
        data: {
          listTitle: buildList(data.listTitle).listTitle,
          boardId: data.boardId,
          userId: TEST_USER_ID,
        },
      });

  if (!list || list.userId !== TEST_USER_ID) {
    throw new Error('List not found for seed-card');
  }

  const position = await prisma.card.count({ where: { listId: list.id } });

  const card = await prisma.card.create({
    data: {
      cardTitle,
      listId: list.id,
      userId: TEST_USER_ID,
      position,
    },
  });

  return { list, card };
}
