import { getRouteApi, Outlet } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { BoardLists } from '~/components/Boards/BoardLists';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { DehydrateQueryClient } from '~/query';

const Route = getRouteApi('/board/$id');

export function BoardByIdPage() {
  const { BoardPageServer } = Route.useLoaderData();
  return (
    <DehydrateQueryClient>
      <Nav />

      <CompositeComponent src={BoardPageServer.src}>
        <BoardLists>
          <Outlet />
        </BoardLists>
      </CompositeComponent>
    </DehydrateQueryClient>
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
