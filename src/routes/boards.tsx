import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardsPage, PendingBoardsPage } from '~/components/pages/BoardsPage';
import { getBoardsServer } from '~/components/server/Boards.functions';
import { getNavBarServer } from '~/components/server/Nav.functions';
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

    return {
      BoardsServer: await getBoardsServer(),
      NavBarServer: await getNavBarServer(),
    };
  },

  pendingComponent: PendingBoardsPage,
  component: BoardsPage,
});
