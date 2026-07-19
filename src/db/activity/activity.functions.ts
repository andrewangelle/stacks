import { createServerFn } from '@tanstack/react-start';
import {
  CreateActivitySchema,
  DeleteActivitySchema,
  UpdateActivitySchema,
} from '~/db/activity/activity.schemas';
import {
  createActivityQuery,
  deleteActivityQuery,
  updateActivityQuery,
} from '~/db/activity/activity.server';
import { authMiddleware } from '~/middleware/auth';

export const createActivity = createServerFn({ method: 'POST' })
  .validator(CreateActivitySchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createActivityQuery({ ...data, userId: context.uid }),
  );

export const updateActivity = createServerFn({ method: 'POST' })
  .validator(UpdateActivitySchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateActivityQuery({ ...data, userId: context.uid }),
  );

export const deleteActivity = createServerFn({ method: 'POST' })
  .validator(DeleteActivitySchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteActivityQuery({ ...data, userId: context.uid }),
  );
