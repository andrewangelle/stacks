import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardByIdPage } from '~/components/pages/BoardByIdPage';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { getBoardById } from '~/db/boards/boards.functions';
import { prefetchBoardPageData } from '~/db/lists/lists.query';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/board/$id')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const board = await getBoardById({ data: { boardId: params.id } });

    await prefetchBoardPageData(context.queryClient, params.id);

    const NavBarServer = await getNavBarServer({
      data: { boardId: params.id },
    });

    const BoardPageServer = await getBoardPageServer({
      data: { boardId: params.id },
    });

    const BoardHeaderServer = await getBoardHeaderServer({
      data: { boardId: params.id },
    });

    return {
      boardColor: board?.boardColor ?? 'blue',
      NavBarServer,
      BoardPageServer,
      BoardHeaderServer,
    };
  },

  component: BoardByIdPage,
});
