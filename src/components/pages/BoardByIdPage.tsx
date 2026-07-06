import { getRouteApi, Outlet } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardListsFallback } from '~/components/Boards/Board.styled';
import { BoardLists } from '~/components/Boards/BoardLists';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { UserNavContent } from '~/components/Nav/UserNavContent';

const Route = getRouteApi('/board/$id');

export function BoardByIdPage() {
  const { BoardPageServer, boardColor } = Route.useLoaderData();
  return (
    <>
      <Nav />

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
}

function Nav() {
  const { NavBarServer, BoardHeaderServer } = Route.useLoaderData();
  return (
    <CompositeComponent
      src={NavBarServer.src}
      renderUserContent={() => <UserNavContent />}
    >
      <CompositeComponent src={BoardHeaderServer.src}>
        <BoardHeader />
      </CompositeComponent>
    </CompositeComponent>
  );
}
