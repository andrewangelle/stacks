import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import * as boardStyles from '~/components/Boards/Board.css';
import { BoardLists } from '~/components/Boards/BoardLists';
import { ListSkeleton } from '~/components/Lists/ListSkeleton';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import * as navStyles from '~/components/Nav/Nav.css';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { getBoardColor } from '~/db/boards/boards.functions';

export const Route = createFileRoute('/board/$id')({
  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const boardColor = await getBoardColor({
      data: { boardId: params.id },
    });

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
      boardColor: boardColor ?? 'blue',
      NavBarServer,
      BoardPageServer,
      BoardHeaderServer,
    };
  },

  component() {
    const { BoardPageServer, NavBarServer, BoardHeaderServer } =
      Route.useLoaderData();
    return (
      <>
        <div
          className={navStyles.navBarContainer}
          data-testid="NavBarContainer"
        >
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>

          <CompositeComponent src={BoardHeaderServer.src}>
            <Suspense
              fallback={
                <div
                  className={boardStyles.boardHeaderFallback}
                  data-testid="BoardHeaderFallback"
                />
              }
            >
              <BoardHeader />
            </Suspense>
          </CompositeComponent>
        </div>

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
