import { createServerFn } from '@tanstack/react-start';
import {
  CreateListSchema,
  DeleteListSchema,
  MoveListSchema,
  ReorderListsSchema,
  UpdateListSchema,
} from '~/db/lists/lists.schemas';
import {
  createListQuery,
  deleteListQuery,
  moveListQuery,
  reorderListsQuery,
  updateListQuery,
} from '~/db/lists/lists.server';
import { authMiddleware } from '~/middleware/auth';

export const createList = createServerFn({ method: 'POST' })
  .validator(CreateListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createListQuery({ ...data, userId: context.uid }),
  );

export const updateList = createServerFn({ method: 'POST' })
  .validator(UpdateListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateListQuery({ ...data, userId: context.uid }),
  );

export const deleteList = createServerFn({ method: 'POST' })
  .validator(DeleteListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteListQuery({ ...data, userId: context.uid }),
  );

export const reorderLists = createServerFn({ method: 'POST' })
  .validator(ReorderListsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    reorderListsQuery({ ...data, userId: context.uid }),
  );

export const moveList = createServerFn({ method: 'POST' })
  .validator(MoveListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    moveListQuery({ ...data, userId: context.uid }),
  );
