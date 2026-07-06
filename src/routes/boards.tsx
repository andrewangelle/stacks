import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardsPage, PendingBoardsPage } from '~/components/pages/BoardsPage';
import { getBoardsServer } from '~/components/server/Boards.functions';
import { getNavBarServer } from '~/components/server/Nav.functions';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/boards')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    await context.queryClient.prefetchQuery(boardsQueryOptions);

    return {
      BoardsServer: await getBoardsServer(),
      NavBarServer: await getNavBarServer({ data: { boardColor: 'blue' } }),
    };
  },

  pendingComponent: PendingBoardsPage,
  component: BoardsPage,
});
