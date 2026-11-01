import { createServerFn } from '@tanstack/react-start';
import { SetCommentsVisibleSchema } from '~/db/user/user.schemas';
import {
  getUserPreferencesQuery,
  setCommentsVisibleQuery,
} from '~/db/user/user.server';
import { authMiddleware } from '~/middleware/auth';

export const getUserPreferences = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) =>
    getUserPreferencesQuery({ userId: context.uid }),
  );

export const setCommentsVisible = createServerFn({ method: 'POST' })
  .validator(SetCommentsVisibleSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    setCommentsVisibleQuery({ ...data, userId: context.uid }),
  );
