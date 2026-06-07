import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card } from '~/components/Cards/Card';
import { fetchUserId } from '~/middleware/auth';
import { cardByIdQueryOptions } from '~/query/cards';

export const Route = createFileRoute('/board/$id/card/$cardId')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    await context.queryClient.ensureQueryData(
      cardByIdQueryOptions(params.cardId),
    );
  },

  component() {
    const { cardId } = Route.useParams();
    return <Card cardId={cardId} />;
  },
});
