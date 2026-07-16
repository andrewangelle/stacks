import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardHeaderFallback } from '~/components/Boards/Board.styled';
import { BoardLists } from '~/components/Boards/BoardLists';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { ListSkeleton } from '~/components/Lists/ListSkeleton';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { NavBarContainer } from '~/components/Nav/Nav.styled';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';

export const Route = createFileRoute('/board/$id')({
  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const board = await context.queryClient.ensureQueryData(
      boardByIdQueryOptions(params.id),
    );

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
            <Suspense
              fallback={
                <BoardHeaderFallback
                  data-testid="BoardHeaderFallback"
                  background={boardColor as BoardBackground}
                />
              }
            >
              <BoardHeader />
            </Suspense>
          </CompositeComponent>
        </NavBarContainer>

        <CompositeComponent src={BoardPageServer.src}>
          <Suspense
            fallback={
              <BoardPageListsSkeleton data-testid="BoardPageListsSkeleton" />
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

function BoardPageListsSkeleton() {
  return ['list1', 'list2', 'list3'].map((list) => <ListSkeleton key={list} />);
}
