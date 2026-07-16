import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }

    context.queryClient.clear();
    throw redirect({ to: '/auth/sign-in' });
  },
});
