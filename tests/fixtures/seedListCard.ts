import { buildCard } from '~test/factories/card';
import { buildList } from '~test/factories/list';
import type { CardRecord } from '~test/mocks/db/card';
import type { ChecklistRecord } from '~test/mocks/db/checklist';
import type { ChecklistItemRecord } from '~test/mocks/db/checklistItem';
import type { ListRecord } from '~test/mocks/db/list';
import { getStore, id, now } from '~test/mocks/memoryPrisma';

type ChecklistSeed = {
  title: string;
  items: string[];
};

export function seedListCard(data: {
  boardId: string;
  listTitle?: string;
  cardTitle?: string;
  checklists: ChecklistSeed[];
}) {
  const { listTitle } = buildList(data.listTitle);
  const { cardTitle } = buildCard(data.cardTitle);
  const timestamp = now();
  const userId = getStore().users[0]?.id;

  if (!userId) {
    throw new Error('E2E user not seeded — call resetMemoryDb() first');
  }

  const board = getStore().stacks.find((stack) => stack.id === data.boardId);

  if (!board || board.userId !== userId) {
    throw new Error('Board not found for seed-list-card');
  }

  const list: ListRecord = {
    id: id(),
    listTitle,
    boardId: data.boardId,
    userId,
    position: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const card: CardRecord = {
    id: id(),
    cardTitle,
    cardDescription: '',
    listId: list.id,
    userId,
    position: 0,
    isCompleted: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const checklists: ChecklistRecord[] = [];
  const checklistItems: ChecklistItemRecord[] = [];

  for (const checklistSeed of data.checklists) {
    const checklist: ChecklistRecord = {
      id: id(),
      checklistTitle: checklistSeed.title,
      hideCheckedItems: false,
      cardId: card.id,
      listId: list.id,
      userId,
      position: checklists.length,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    checklists.push(checklist);

    for (const [itemIndex, label] of checklistSeed.items.entries()) {
      checklistItems.push({
        id: id(),
        label,
        isCompleted: false,
        cardId: card.id,
        checklistId: checklist.id,
        listId: list.id,
        userId,
        position: itemIndex,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  }

  getStore().lists.push(list);
  getStore().cards.push(card);
  getStore().checklists.push(...checklists);
  getStore().checklistItems.push(...checklistItems);

  return { list, card, checklists, checklistItems };
}
