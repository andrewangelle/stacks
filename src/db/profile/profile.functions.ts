import { createServerFn } from '@tanstack/react-start';
import { GetProfileSchema } from '~/db/profile/profile.schemas';
import { getProfileQuery } from '~/db/profile/profile.server';
import { authMiddleware } from '~/middleware/auth';

export const getProfile = createServerFn({ method: 'GET' })
  .inputValidator(GetProfileSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getProfileQuery({ ...data, userId: context.uid }),
  );
