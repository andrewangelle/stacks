import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { buildBoard } from '~test/factories/board';
import type { StackRecord } from '~test/mocks/db/stack';
import { getStore, id, now } from '~test/mocks/memoryPrisma';

export function seedBoard(data?: {
  boardTitle?: string;
  boardColor?: BoardBackground;
}) {
  const { boardTitle, boardColor } = buildBoard(data);
  const timestamp = now();
  const userId = getStore().users[0]?.id;

  if (!userId) {
    throw new Error('E2E user not seeded — call resetMemoryDb() first');
  }

  const board: StackRecord = {
    id: id(),
    boardTitle,
    boardColor,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getStore().stacks.push(board);

  return board;
}
