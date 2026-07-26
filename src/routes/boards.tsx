import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardListFallback } from '~/components/Boards/BoardListFallback';
import { Boards } from '~/components/Boards/Boards';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as navStyles from '~/components/Nav/Nav.css';
import { NavBarFallback } from '~/components/Nav/NavBarClient';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardsServer } from '~/components/server/Boards.functions';
import { getNavBarServer } from '~/components/server/Nav.functions';
import { boardsQueryOptions } from '~/db/boards/boards.query';

export const Route = createFileRoute('/boards')({
  async loader({ context }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    context.queryClient.prefetchQuery(boardsQueryOptions);

    return {
      BoardsServer: await getBoardsServer(),
      NavBarServer: await getNavBarServer(),
    };
  },

  pendingComponent() {
    return (
      <>
        <NavBarFallback />
        <div
          className={boardsStyles.boardsContainer}
          data-testid="BoardsContainer"
        >
          <BoardListFallback />
        </div>
      </>
    );
  },

  component() {
    const { BoardsServer, NavBarServer } = Route.useLoaderData();
    return (
      <>
        <div
          className={navStyles.navBarContainer}
          data-testid="NavBarContainer"
        >
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>
        </div>

        <CompositeComponent src={BoardsServer.src}>
          <Suspense fallback={<BoardListFallback />}>
            <Boards />
          </Suspense>
        </CompositeComponent>
      </>
    );
  },
});
