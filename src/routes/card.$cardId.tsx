import { createFileRoute, redirect } from '@tanstack/react-router';
import { BoardPage } from '~/components/Boards/BoardPage';
import { Card } from '~/components/Cards/Card';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { getBoardIdByCardId } from '~/db/cards/cards.functions';
import { fetchUserId } from '~/middleware/auth';
import { boardByIdQueryOptions } from '~/query/boards';
import { cardByIdQueryOptions } from '~/query/cards';
import { listsQueryOptions } from '~/query/lists';

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
    return <BoardPageBackground data-testid="BoardPageBackground" />;
  },

  component() {
    return (
      <BoardPage>
        <Card />
      </BoardPage>
    );
  },
});
