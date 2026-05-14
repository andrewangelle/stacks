import { auth, clerkClient } from '@clerk/tanstack-react-start/server';
import { redirect } from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return data({ message: 'Unauthorized' }, 401);
  }
  const user = await clerkClient().users.getUser(userId);

  return await next({
    context: {
      uid: user.id,
    },
  });
});

export const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    throw redirect({
      to: '/auth/sign-in',
    });
  }

  // Get the user's full `Backend User` object
  const user = await clerkClient().users.getUser(userId);

  return { userId, firstName: user?.firstName };
});
