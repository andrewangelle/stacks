import { createServerFn } from '@tanstack/react-start';
import { getProfileQuery } from '~/db/profile/profile.server';
import { authMiddleware } from '~/middleware/auth';

export const getProfile = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getProfileQuery({ userId: context.uid }));
