import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardByIdPage } from '~/components/pages/BoardByIdPage';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
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
      NavBarServer,
      BoardPageServer,
      BoardHeaderServer,
    };
  },

  component: BoardByIdPage,
});
