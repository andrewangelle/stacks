import { auth, clerkClient } from '@clerk/tanstack-react-start/server';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { upsertUserAndProfile } from '~/db/upsertUserAndProfile';
import { data } from '~/utils/response';

export const userIdMiddleware = createMiddleware().server(async ({ next }) => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return data({ message: 'Unauthorized' }, 401);
  }

  return await next({
    context: {
      uid: userId,
    },
  });
});

export const authResourceRouteMiddleware = createMiddleware()
  .middleware([userIdMiddleware])
  .server(async ({ next, context }) => {
    if (!context.uid) {
      return data({ message: 'Unauthorized' }, 401);
    }

    const user = await clerkClient().users.getUser(context.uid);
    await upsertUserAndProfile(user);

    return await next();
  });

export const fetchUserId = createServerFn().handler(async () => {
  const { userId } = await auth();
  return { userId };
});

export const fetchToken = createServerFn().handler(async () => {
  const { getToken } = await auth();
  return await getToken();
});
