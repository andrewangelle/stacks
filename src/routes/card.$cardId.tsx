import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { BoardListsFallback } from '~/components/Boards/Board.styled';
import { BoardLists } from '~/components/Boards/BoardLists';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import { NavBarContainer } from '~/components/Nav/Nav.styled';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { getBoardIdByCardId } from '~/db/cards/cards.functions';

export const Route = createFileRoute('/card/$cardId')({
  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    await context.queryClient.ensureQueryData(boardsQueryOptions);

    const cardQuery = await getBoardIdByCardId({
      data: { cardId: params.cardId },
    });

    if (!cardQuery) {
      throw redirect({ to: '/boards' });
    }

    const NavBarServer = await getNavBarServer({
      data: { boardId: cardQuery.boardId },
    });

    const BoardHeaderServer = await getBoardHeaderServer({
      data: { boardId: cardQuery.boardId },
    });

    const BoardPageServer = context.isMobile
      ? null
      : await getBoardPageServer({ data: { boardId: cardQuery.boardId } });

    return {
      boardId: cardQuery.boardId,
      cardId: cardQuery.cardId,
      boardColor: cardQuery.boardColor,
      isMobile: context.isMobile,
      BoardPageServer,
      NavBarServer,
      BoardHeaderServer,
    };
  },

  component() {
    const {
      BoardPageServer,
      NavBarServer,
      BoardHeaderServer,
      boardColor,
      isMobile,
    } = Route.useLoaderData();

    return (
      <>
        <NavBarContainer data-testid="NavBarContainer">
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>

          <CompositeComponent src={BoardHeaderServer.src}>
            <BoardHeader />
          </CompositeComponent>
        </NavBarContainer>

        {isMobile ? (
          <Suspense fallback={<CardFallback />}>
            <Card variant="page" />
          </Suspense>
        ) : (
          BoardPageServer && (
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
                  <Suspense fallback={<CardFallback />}>
                    <Card />
                  </Suspense>
                </BoardLists>
              </Suspense>
            </CompositeComponent>
          )
        )}
      </>
    );
  },
});
