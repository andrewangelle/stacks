import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardLists } from '~/components/Boards/BoardLists';
import { Card } from '~/components/Cards/Card';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { UserNavContent } from '~/components/Nav/UserNavContent';

const Route = getRouteApi('/card/$cardId');

export function CardPage() {
  const { CardServer, BoardServer } = Route.useLoaderData();
  return (
    <>
      <Nav />

      <CompositeComponent src={BoardServer.src}>
        <BoardLists>
          <Suspense fallback={null}>
            <CompositeComponent src={CardServer.src}>
              <Card />
            </CompositeComponent>
          </Suspense>
        </BoardLists>
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
