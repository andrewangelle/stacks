import { auth, clerkClient } from '@clerk/tanstack-react-start/server';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { upsertUserAndProfile } from '~/db/upsertUserAndProfile';
import { data } from '~/utils/response';

export const userIdMiddleware = createMiddleware().server(async ({ next }) => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return data(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );
  }

  return await next({
    context: {
      uid: userId,
    },
  });
});

export const authMiddleware = createMiddleware()
  .middleware([userIdMiddleware])
  .server(async ({ next, context }) => {
    if (!context.uid) {
      return data(
        { message: 'Unauthorized' },
        { status: 401, statusText: 'Unauthorized' },
      );
    }
    const response = await next();
    const user = await clerkClient().users.getUser(context.uid);
    await upsertUserAndProfile(user);

    return response;
  });

export const fetchUserId = createServerFn().handler(async () => {
  const { userId } = await auth();
  return { userId };
});
