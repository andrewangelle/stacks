import { createServerFn } from '@tanstack/react-start';
import {
  CreateChecklistSchema,
  DeleteChecklistSchema,
  GetChecklistByIdSchema,
  GetChecklistsSchema,
} from '~/db/checklists/checklists.schemas';
import {
  createChecklistQuery,
  deleteChecklistQuery,
  getChecklistByIdQuery,
  getChecklistsQuery,
} from '~/db/checklists/checklists.server';
import { authMiddleware } from '~/middleware/auth';

export const getChecklists = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getChecklistsQuery({ ...data, userId: context.uid }),
  );

export const getChecklistById = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getChecklistByIdQuery({ ...data, userId: context.uid }),
  );

export const createChecklist = createServerFn({ method: 'POST' })
  .inputValidator(CreateChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createChecklistQuery({ ...data, userId: context.uid }),
  );

export const deleteChecklist = createServerFn({ method: 'POST' })
  .inputValidator(DeleteChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteChecklistQuery({ ...data, userId: context.uid }),
  );
