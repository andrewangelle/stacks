import { prisma } from '~/db/prisma';
import { TEST_USER_ID } from '~test/mocks/constants';

export async function setCommentsVisible(data: { commentsVisible: boolean }) {
  return prisma.user.update({
    where: { id: TEST_USER_ID },
    data: { commentsVisible: data.commentsVisible },
    select: { commentsVisible: true },
  });
}
