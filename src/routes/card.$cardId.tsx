import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import * as boardStyles from '~/components/Boards/Board.css';
import { BoardLists } from '~/components/Boards/BoardLists';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';
import { BoardHeader } from '~/components/Nav/BoardHeader';
import * as navStyles from '~/components/Nav/Nav.css';
import { UserNavContent } from '~/components/Nav/UserNavContent';
import { getBoardPageServer } from '~/components/server/Board.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { getBoardIdByCardId } from '~/db/cards/cards.functions';
import type { BoardBackground } from '~/styles/tokens';

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
        <div
          className={navStyles.navBarContainer}
          data-testid="NavBarContainer"
        >
          <CompositeComponent src={NavBarServer.src}>
            <UserNavContent />
          </CompositeComponent>

          <CompositeComponent src={BoardHeaderServer.src}>
            <BoardHeader />
          </CompositeComponent>
        </div>

        {isMobile ? (
          <Suspense fallback={<CardFallback />}>
            <Card variant="page" />
          </Suspense>
        ) : (
          BoardPageServer && (
            <CompositeComponent src={BoardPageServer.src}>
              <Suspense
                fallback={
                  <div
                    className={boardStyles.boardListsFallback({
                      background: boardColor as BoardBackground,
                    })}
                    data-testid="BoardListsFallback"
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
