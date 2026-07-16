import { buildCard } from '~test/factories/card';
import { buildList } from '~test/factories/list';
import type { CardRecord } from '~test/mocks/db/card';
import type { ListRecord } from '~test/mocks/db/list';
import { getStore, id, now } from '~test/mocks/memoryPrisma';

export function seedCard(data: {
  boardId: string;
  listId?: string;
  listTitle?: string;
  cardTitle?: string;
}) {
  const { cardTitle } = buildCard(data.cardTitle);
  const timestamp = now();
  const userId = getStore().users[0]?.id;

  if (!userId) {
    throw new Error('E2E user not seeded — call resetMemoryDb() first');
  }

  const board = getStore().stacks.find((stack) => stack.id === data.boardId);

  if (!board || board.userId !== userId) {
    throw new Error('Board not found for seed-card');
  }

  // Append to an existing list when given a listId, so a list can hold several
  // cards; otherwise create a fresh list for this card.
  let list: ListRecord | undefined;

  if (data.listId) {
    list = getStore().lists.find((item) => item.id === data.listId);

    if (!list) {
      throw new Error('List not found for seed-card');
    }
  } else {
    const { listTitle } = buildList(data.listTitle);
    list = {
      id: id(),
      listTitle,
      boardId: data.boardId,
      userId,
      position: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    getStore().lists.push(list);
  }

  const position = getStore().cards.filter(
    (existing) => existing.listId === list.id,
  ).length;

  const card: CardRecord = {
    id: id(),
    cardTitle,
    cardDescription: '',
    listId: list.id,
    userId,
    position,
    isCompleted: false,
    isChecklistsExpanded: false,
    expandedChecklistId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getStore().cards.push(card);

  return { list, card };
}
