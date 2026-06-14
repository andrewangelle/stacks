import { createServerFn } from '@tanstack/react-start';
import {
  CreateChecklistItemSchema,
  DeleteChecklistItemSchema,
  GetChecklistItemByIdSchema,
  GetChecklistItemsSchema,
  MoveChecklistItemSchema,
  ReorderChecklistItemsSchema,
  UpdateChecklistItemSchema,
} from '~/db/checklistItems/checklistItems.schemas';
import {
  createChecklistItemQuery,
  deleteChecklistItemQuery,
  getChecklistItemByIdQuery,
  getChecklistItemsQuery,
  moveChecklistItemQuery,
  reorderChecklistItemsQuery,
  updateChecklistItemQuery,
} from '~/db/checklistItems/checklistItems.server';
import { authMiddleware } from '~/middleware/auth';

export const getChecklistItems = createServerFn({ method: 'GET' })
  .validator(GetChecklistItemsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getChecklistItemsQuery({ ...data, userId: context.uid }),
  );

export const getChecklistItemById = createServerFn({ method: 'GET' })
  .validator(GetChecklistItemByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getChecklistItemByIdQuery({ ...data, userId: context.uid }),
  );

export const createChecklistItem = createServerFn({ method: 'POST' })
  .validator(CreateChecklistItemSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createChecklistItemQuery({ ...data, userId: context.uid }),
  );

export const updateChecklistItem = createServerFn({ method: 'POST' })
  .validator(UpdateChecklistItemSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateChecklistItemQuery({ ...data, userId: context.uid }),
  );

export const deleteChecklistItem = createServerFn({ method: 'POST' })
  .validator(DeleteChecklistItemSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteChecklistItemQuery({ ...data, userId: context.uid }),
  );

export const reorderChecklistItems = createServerFn({ method: 'POST' })
  .validator(ReorderChecklistItemsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    reorderChecklistItemsQuery({ ...data, userId: context.uid }),
  );

export const moveChecklistItem = createServerFn({ method: 'POST' })
  .validator(MoveChecklistItemSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    moveChecklistItemQuery({ ...data, userId: context.uid }),
  );
