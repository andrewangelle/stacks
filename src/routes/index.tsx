import { useUser } from '@clerk/tanstack-react-start';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { authStateFn } from '~/auth/middleware';

export const Route = createFileRoute('/')({
  async beforeLoad() {
    return await authStateFn();
  },
  component() {
    const { user } = useUser();
    console.log(user);
    if (user) {
      return <Navigate to="/boards" />;
    }

    return <Navigate to="/auth/sign-in" />;
  },
});
