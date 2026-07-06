import { createFileRoute, redirect } from '@tanstack/react-router';
import { fetchUserId } from '~/middleware/auth';

export const Route = createFileRoute('/')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }

    context.queryClient.clear();
    throw redirect({ to: '/auth/sign-in' });
  },
});
