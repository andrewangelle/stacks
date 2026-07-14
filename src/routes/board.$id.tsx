import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardListsFallback } from '~/components/Boards/Board.styled';
import { BoardLists } from '~/components/Boards/BoardLists';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { NavBarContainer } from '~/components/Nav/Nav.styled';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
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
      boardId: params.id,
      boardColor: board?.boardColor ?? 'blue',
      NavBarServer,
      BoardPageServer,
      BoardHeaderServer,
    };
  },

  component() {
    const { BoardPageServer, NavBarServer, BoardHeaderServer, boardColor } =
      Route.useLoaderData();
    return (
      <>
        <NavBarContainer data-testid="NavBarContainer">
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>

          <CompositeComponent src={BoardHeaderServer.src}>
            <BoardHeader />
          </CompositeComponent>
        </NavBarContainer>

        <CompositeComponent src={BoardPageServer.src}>
          <Suspense
            fallback={
              <BoardListsFallback
                data-testid="BoardListsFallback"
                background={boardColor}
              />
            }
          >
            <BoardLists>
              <Outlet />
            </BoardLists>
          </Suspense>
        </CompositeComponent>
      </>
    );
  },
});
