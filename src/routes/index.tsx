import { createFileRoute, redirect } from '@tanstack/react-router';
import { authStateFn } from '~/auth/middleware';

export const Route = createFileRoute('/')({
  async beforeLoad() {
    const { userId } = await authStateFn();
    return { userId };
  },
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }
    throw redirect({ to: '/auth/sign-in' });
  },
});
