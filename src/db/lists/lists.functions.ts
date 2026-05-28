import { createServerFn } from '@tanstack/react-start';
import {
  CreateListSchema,
  DeleteListSchema,
  GetListByIdSchema,
  GetListsSchema,
  UpdateListSchema,
} from '~/db/lists/lists.schemas';
import {
  createListQuery,
  deleteListQuery,
  getListByIdQuery,
  getListsQuery,
  updateListQuery,
} from '~/db/lists/lists.server';
import { authMiddleware } from '~/middleware/auth';

export const getLists = createServerFn({ method: 'GET' })
  .inputValidator(GetListsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getListsQuery({ ...data, userId: context.uid }),
  );

export const getListById = createServerFn({ method: 'GET' })
  .inputValidator(GetListByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getListByIdQuery({ ...data, userId: context.uid }),
  );

export const createList = createServerFn({ method: 'POST' })
  .inputValidator(CreateListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createListQuery({ ...data, userId: context.uid }),
  );

export const updateList = createServerFn({ method: 'POST' })
  .inputValidator(UpdateListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateListQuery({ ...data, userId: context.uid }),
  );

export const deleteList = createServerFn({ method: 'POST' })
  .inputValidator(DeleteListSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteListQuery({ ...data, userId: context.uid }),
  );
