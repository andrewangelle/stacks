import { prisma } from '~/db/prisma';
import type { BoardBackground } from '~/styles/tokens';
import { buildBoard } from '~test/factories/board';
import { TEST_USER_ID } from '~test/mocks/constants';

export async function seedBoard(data?: {
  boardTitle?: string;
  boardColor?: BoardBackground;
}) {
  const { boardTitle, boardColor } = buildBoard(data);

  return prisma.stack.create({
    data: {
      boardTitle,
      boardColor,
      userId: TEST_USER_ID,
    },
  });
}
