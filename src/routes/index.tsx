import { createFileRoute, redirect } from '@tanstack/react-router';
import { fetchUserId } from '~/auth/middleware';

export const Route = createFileRoute('/')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }
    throw redirect({ to: '/auth/sign-in' });
  },
});
