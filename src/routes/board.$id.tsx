import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { BoardLists } from '~/components/Boards/BoardLists';
import { BoardPageNav } from '~/components/Nav/BoardPageNav';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { fetchUserId } from '~/middleware/auth';
import { DehydrateQueryClient } from '~/query';

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

  component() {
    const { BoardPageServer } = Route.useLoaderData();
    return (
      <DehydrateQueryClient>
        <BoardPageNav />

        <CompositeComponent src={BoardPageServer.src}>
          <BoardLists>
            <Outlet />
          </BoardLists>
        </CompositeComponent>
      </DehydrateQueryClient>
    );
  },
});
