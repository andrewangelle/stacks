import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Board } from '~/components/Boards/Board';
import {
  BoardCardSkeleton,
  BoardsContainer,
} from '~/components/Boards/Boards.styled';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { NavFallback } from '~/components/Nav/NavFallback';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardsServer } from '~/components/server/Boards.functions';
import { getNavBarServer } from '~/components/server/Nav.functions';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { fetchUserId } from '~/middleware/auth';
import { DehydrateQueryClient } from '~/query';

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

  pendingComponent() {
    return (
      <>
        <NavFallback />
        <BoardsContainer data-testid="BoardsContainer">
          {(['one', 'two', 'three'] as const).map((id) => (
            <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
          ))}
        </BoardsContainer>
      </>
    );
  },

  component() {
    const { BoardsServer, NavBarServer } = Route.useLoaderData();
    const { data: boards } = useSuspenseQuery(boardsQueryOptions);
    return (
      <DehydrateQueryClient>
        <CompositeComponent
          src={NavBarServer.src}
          renderUserContent={() => <UserNavContent />}
        />
        <CompositeComponent src={BoardsServer.src}>
          {boards.map((board) => (
            <Board key={board.id} boardId={board.id} />
          ))}
          <CreateBoard />
        </CompositeComponent>
      </DehydrateQueryClient>
    );
  },
});
