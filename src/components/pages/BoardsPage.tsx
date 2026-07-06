import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Boards } from '~/components/Boards/Boards';
import {
  BoardCardSkeleton,
  BoardsContainer,
} from '~/components/Boards/Boards.styled';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { DehydrateQueryClient } from '~/query';

const Route = getRouteApi('/boards');

export function BoardsPage() {
  const { BoardsServer, NavBarServer } = Route.useLoaderData();
  return (
    <DehydrateQueryClient>
      <CompositeComponent
        src={NavBarServer.src}
        renderUserContent={() => <UserNavContent />}
      />
      <CompositeComponent src={BoardsServer.src}>
        <Boards />
      </CompositeComponent>
    </DehydrateQueryClient>
  );
}

export function PendingBoardsPage() {
  return (
    <>
      <NavBarClient />
      <BoardsContainer data-testid="BoardsContainer">
        {(['one', 'two', 'three'] as const).map((id) => (
          <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
        ))}
      </BoardsContainer>
    </>
  );
}
