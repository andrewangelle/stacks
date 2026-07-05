import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { BoardLists } from '~/components/Boards/BoardLists';
import { Card } from '~/components/Cards/Card';
import { CardPageNav } from '~/components/Nav/CardPageNav';
import { getBoardPageServer } from '~/components/server/Board.functions';
import { getCardServer } from '~/components/server/Card.functions';
import {
  getBoardHeaderServer,
  getNavBarServer,
} from '~/components/server/Nav.functions';
import { getBoardIdByCardId } from '~/db/cards/cards.functions';
import { fetchUserId } from '~/middleware/auth';
import { DehydrateQueryClient } from '~/query';

export const Route = createFileRoute('/card/$cardId')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const cardQuery = await getBoardIdByCardId({
      data: { cardId: params.cardId },
    });

    if (!cardQuery) {
      throw redirect({ to: '/boards' });
    }

    const CardServer = await getCardServer({
      data: { cardId: cardQuery.cardId, boardId: cardQuery.boardId },
    });

    const BoardServer = await getBoardPageServer({
      data: { boardId: cardQuery.boardId },
    });

    const NavBarServer = await getNavBarServer({
      data: { boardId: cardQuery.boardId },
    });

    const BoardHeaderServer = await getBoardHeaderServer({
      data: { boardId: cardQuery.boardId },
    });

    return {
      boardId: cardQuery.boardId,
      cardId: cardQuery.cardId,
      boardColor: cardQuery.boardColor,
      CardServer,
      BoardServer,
      NavBarServer,
      BoardHeaderServer,
    };
  },

  component() {
    const { CardServer, BoardServer } = Route.useLoaderData();
    return (
      <DehydrateQueryClient>
        <CardPageNav />

        <CompositeComponent src={BoardServer.src}>
          <BoardLists>
            <CompositeComponent src={CardServer.src}>
              <Card />
            </CompositeComponent>
          </BoardLists>
        </CompositeComponent>
      </DehydrateQueryClient>
    );
  },
});
