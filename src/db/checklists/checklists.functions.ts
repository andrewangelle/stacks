import { createServerFn } from '@tanstack/react-start';
import {
  CreateChecklistSchema,
  DeleteChecklistSchema,
  GetChecklistByIdSchema,
  GetChecklistsSchema,
  UpdateChecklistSchema,
} from '~/db/checklists/checklists.schemas';
import {
  createChecklistQuery,
  deleteChecklistQuery,
  getCardTitleDetailsChecklistsQuery,
  getChecklistByIdQuery,
  getChecklistsQuery,
  updateChecklistQuery,
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

export const updateChecklist = createServerFn({ method: 'POST' })
  .inputValidator(UpdateChecklistSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateChecklistQuery({ ...data, userId: context.uid }),
  );

export const getCardTitleDetailsChecklists = createServerFn({ method: 'GET' })
  .inputValidator(GetChecklistsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getCardTitleDetailsChecklistsQuery({ ...data, userId: context.uid }),
  );
