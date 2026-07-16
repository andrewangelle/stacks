import { createFileRoute, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';
import { Card } from '~/components/Cards/Card';
import { CardFallback } from '~/components/Cards/CardFallback';

export const Route = createFileRoute('/board/$id/card/$cardId')({
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
