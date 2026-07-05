import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { UserNavContent } from '~/components/Nav/UserNavContent';

const Route = getRouteApi('/card/$cardId');

export function CardPageNav() {
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
