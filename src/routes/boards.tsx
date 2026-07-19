import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardListFallback } from '~/components/Boards/BoardListFallback';
import { Boards } from '~/components/Boards/Boards';
import { BoardsContainer } from '~/components/Boards/Boards.styled';
import { NavBarContainer } from '~/components/Nav/Nav.styled';
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

    await context.queryClient.ensureQueryData(boardsQueryOptions);

    return {
      BoardsServer: await getBoardsServer(),
      NavBarServer: await getNavBarServer(),
    };
  },

  pendingComponent() {
    return (
      <>
        <NavBarFallback />
        <BoardsContainer data-testid="BoardsContainer">
          <BoardListFallback />
        </BoardsContainer>
      </>
    );
  },

  component() {
    const { BoardsServer, NavBarServer } = Route.useLoaderData();
    return (
      <>
        <NavBarContainer data-testid="NavBarContainer">
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>
        </NavBarContainer>

        <CompositeComponent src={BoardsServer.src}>
          <Suspense fallback={<BoardListFallback />}>
            <Boards />
          </Suspense>
        </CompositeComponent>
      </>
    );
  },
});
