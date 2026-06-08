import { buildCard } from '~test/factories/card';
import { buildList } from '~test/factories/list';
import type { CardRecord } from '~test/mocks/db/card';
import type { ListRecord } from '~test/mocks/db/list';
import { getStore, id, now } from '~test/mocks/memoryPrisma';

export function seedCard(data: {
  boardId: string;
  listTitle?: string;
  cardTitle?: string;
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
    throw new Error('Board not found for seed-card');
  }

  const list: ListRecord = {
    id: id(),
    listTitle,
    boardId: data.boardId,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const card: CardRecord = {
    id: id(),
    cardTitle,
    cardDescription: '',
    listId: list.id,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getStore().lists.push(list);
  getStore().cards.push(card);

  return { list, card };
}
