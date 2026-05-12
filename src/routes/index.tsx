import { createFileRoute, Navigate } from '@tanstack/react-router';
import { authClient } from '~/auth/client';

export const Route = createFileRoute('/')({
  component() {
    const { data, isPending } = authClient.useSession();

    if (isPending) {
      return null;
    }

    if (data?.user) {
      return <Navigate to="/boards" />;
    }

    return <Navigate to="/auth/sign-in" />;
  },
});
