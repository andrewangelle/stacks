import { createServerFn } from '@tanstack/react-start';
import {
  CreateChecklistSchema,
  DeleteChecklistSchema,
  ReorderChecklistsSchema,
  UpdateChecklistSchema,
} from '~/db/checklists/checklists.schemas';
import {
  createChecklistQuery,
  deleteChecklistQuery,
  reorderChecklistsQuery,
  updateChecklistQuery,
} from '~/db/checklists/checklists.server';
import { authMiddleware } from '~/middleware/auth';

export const createChecklist = createServerFn({ method: 'POST' })
  .validator(CreateChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createChecklistQuery({ ...data, userId: context.uid }),
  );

export const deleteChecklist = createServerFn({ method: 'POST' })
  .validator(DeleteChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteChecklistQuery({ ...data, userId: context.uid }),
  );

export const updateChecklist = createServerFn({ method: 'POST' })
  .validator(UpdateChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateChecklistQuery({ ...data, userId: context.uid }),
  );

export const reorderChecklists = createServerFn({ method: 'POST' })
  .validator(ReorderChecklistsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    reorderChecklistsQuery({ ...data, userId: context.uid }),
  );
