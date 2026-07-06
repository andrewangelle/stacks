import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { Boards } from '~/components/Boards/Boards';
import {
  BoardCardSkeleton,
  BoardsContainer,
} from '~/components/Boards/Boards.styled';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import { UserNavContent } from '~/components/Nav/UserNavContent';

const Route = getRouteApi('/boards');

export function BoardsPage() {
  const { BoardsServer, NavBarServer } = Route.useLoaderData();
  return (
    <>
      <CompositeComponent
        src={NavBarServer.src}
        renderUserContent={() => <UserNavContent />}
        boardColor="blue"
      />
      <CompositeComponent src={BoardsServer.src}>
        <Suspense
          fallback={(['one', 'two', 'three'] as const).map((id) => (
            <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
          ))}
        >
          <Boards />
        </Suspense>
      </CompositeComponent>
    </>
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
