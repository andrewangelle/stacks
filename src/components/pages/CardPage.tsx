import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Card } from '~/components/Cards/Card';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { DehydrateQueryClient } from '~/query';
import { BoardLists } from '../Boards/BoardLists';

const Route = getRouteApi('/card/$cardId');

export function CardPage() {
  const { CardServer, BoardServer } = Route.useLoaderData();
  return (
    <DehydrateQueryClient>
      <Nav />

      <CompositeComponent src={BoardServer.src}>
        <BoardLists>
          <CompositeComponent src={CardServer.src}>
            <Card />
          </CompositeComponent>
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
