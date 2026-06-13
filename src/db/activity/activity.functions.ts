import { createServerFn } from '@tanstack/react-start';
import {
  CreateActivitySchema,
  DeleteActivitySchema,
  GetActivityByIdSchema,
  GetActivitySchema,
  UpdateActivitySchema,
} from '~/db/activity/activity.schemas';
import {
  createActivityQuery,
  deleteActivityQuery,
  getActivityByIdQuery,
  getActivityQuery,
  updateActivityQuery,
} from '~/db/activity/activity.server';
import { authMiddleware } from '~/middleware/auth';

export const getActivity = createServerFn({ method: 'GET' })
  .validator(GetActivitySchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getActivityQuery({ ...data, userId: context.uid }),
  );

export const getActivityById = createServerFn({ method: 'GET' })
  .validator(GetActivityByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getActivityByIdQuery({ ...data, userId: context.uid }),
  );

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
