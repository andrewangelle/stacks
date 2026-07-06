import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardByIdPage } from '~/components/pages/BoardByIdPage';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/board/$id')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const board = await context.queryClient.ensureQueryData(
      boardByIdQueryOptions(params.id),
    );

    const NavBarServer = await getNavBarServer({
      data: { boardId: params.id, boardColor: board?.boardColor ?? 'blue' },
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
