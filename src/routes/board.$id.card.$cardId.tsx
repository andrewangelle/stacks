import { createFileRoute, redirect } from '@tanstack/react-router';
import { CompositeComponent } from '@tanstack/react-start/rsc';
import { Suspense } from 'react';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';
import { getCardServer } from '~/components/server/Card.functions';
import { fetchUserId } from '~/middleware/auth';

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

    const CardServer = await getCardServer({
      data: { cardId: params.cardId, boardId: params.id },
    });

    return { CardServer };
  },

  pendingComponent: CardFallback,

  component() {
    const { CardServer } = Route.useLoaderData();
    return (
      <CompositeComponent src={CardServer.src}>
        <Suspense fallback={<CardFallback />}>
          <Card />
        </Suspense>
      </CompositeComponent>
    );
  },
});
