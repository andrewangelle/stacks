import { createFileRoute, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/board/$id/card/$cardId')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }
  },

  pendingComponent: CardFallback,

  component() {
    return (
      <Suspense fallback={<CardFallback />}>
        <Card />
      </Suspense>
    );
  },
});
