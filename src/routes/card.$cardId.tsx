import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardPage } from '~/components/Boards/BoardPage';
import { Card } from '~/components/Cards/Card';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { getBoardIdByCardId } from '~/db/cards/cards.functions';
import { cardByIdQueryOptions } from '~/db/cards/cards.query';
import { listsQueryOptions } from '~/db/lists/lists.query';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/card/$cardId')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    const cardRoute = await getBoardIdByCardId({
      data: { cardId: params.cardId },
    });

    if (!cardRoute) {
      throw redirect({ to: '/boards' });
    }

    await context.queryClient.ensureQueryData(
      boardByIdQueryOptions(cardRoute.boardId),
    );
    await context.queryClient.ensureQueryData(
      listsQueryOptions(cardRoute.boardId),
    );
    await context.queryClient.ensureQueryData(
      cardByIdQueryOptions(cardRoute.cardId),
    );

    return cardRoute;
  },

  pendingComponent() {
    return <BoardPage>{null}</BoardPage>;
  },

  component() {
    return (
      <BoardPage>
        <Card />
      </BoardPage>
    );
  },
});
