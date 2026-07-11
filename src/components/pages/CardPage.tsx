import { getRouteApi } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardLists } from '~/components/Boards/BoardLists';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';
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
          <CompositeComponent src={CardServer.src}>
            <Suspense fallback={<CardFallback />}>
              <Card />
            </Suspense>
          </CompositeComponent>
        </BoardLists>
      </CompositeComponent>
    </>
  );
}

function Nav() {
  const { NavBarServer, BoardHeaderServer, boardColor } = Route.useLoaderData();
  return (
    <CompositeComponent
      src={NavBarServer.src}
      boardColor={boardColor as BoardBackground}
      renderUserContent={() => <UserNavContent />}
    >
      <CompositeComponent src={BoardHeaderServer.src}>
        <BoardHeader />
      </CompositeComponent>
    </CompositeComponent>
  );
}
