import { prisma } from '~/db/prisma';
import { buildCard } from '~test/factories/card';
import { buildList } from '~test/factories/list';
import { TEST_USER_ID } from '~test/mocks/constants';

type ChecklistSeed = {
  title: string;
  items: string[];
};

export async function seedListCard(data: {
  boardId: string;
  listTitle?: string;
  cardTitle?: string;
  checklists: ChecklistSeed[];
}) {
  const { listTitle } = buildList(data.listTitle);
  const { cardTitle } = buildCard(data.cardTitle);

  const list = await prisma.list.create({
    data: {
      listTitle,
      boardId: data.boardId,
      userId: TEST_USER_ID,
    },
  });

  const card = await prisma.card.create({
    data: {
      cardTitle,
      listId: list.id,
      userId: TEST_USER_ID,
    },
  });

  const checklists: Awaited<ReturnType<typeof prisma.checklist.create>>[] = [];
  const checklistItems: Awaited<
    ReturnType<typeof prisma.checklistItem.create>
  >[] = [];

  for (const [checklistIndex, checklistSeed] of data.checklists.entries()) {
    const checklist = await prisma.checklist.create({
      data: {
        checklistTitle: checklistSeed.title,
        cardId: card.id,
        listId: list.id,
        userId: TEST_USER_ID,
        position: checklistIndex,
      },
    });

    checklists.push(checklist);

    for (const [itemIndex, label] of checklistSeed.items.entries()) {
      const item = await prisma.checklistItem.create({
        data: {
          label,
          cardId: card.id,
          checklistId: checklist.id,
          listId: list.id,
          userId: TEST_USER_ID,
          position: itemIndex,
        },
      });

      checklistItems.push(item);
    }
  }

  return { list, card, checklists, checklistItems };
}
