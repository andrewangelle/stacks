import { createServerFn } from '@tanstack/react-start';
import {
  CreateCardSchema,
  DeleteCardSchema,
  GetCardByIdSchema,
  GetCardsByListIdSchema,
  UpdateCardSchema,
} from '~/db/cards/cards.schemas';
import {
  createCardQuery,
  deleteCardQuery,
  getBoardIdByCardIdQuery,
  getCardByIdQuery,
  getCardsByListIdQuery,
  updateCardQuery,
} from '~/db/cards/cards.server';
import { authMiddleware } from '~/middleware/auth';

export const getCardsByListId = createServerFn({ method: 'GET' })
  .inputValidator(GetCardsByListIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getCardsByListIdQuery({ ...data, userId: context.uid }),
  );

export const getCardById = createServerFn({ method: 'GET' })
  .inputValidator(GetCardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getCardByIdQuery({ ...data, userId: context.uid }),
  );

export const getBoardIdByCardId = createServerFn({ method: 'GET' })
  .inputValidator(GetCardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getBoardIdByCardIdQuery({ ...data, userId: context.uid }),
  );

export const createCard = createServerFn({ method: 'POST' })
  .inputValidator(CreateCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createCardQuery({ ...data, userId: context.uid }),
  );

export const updateCard = createServerFn({ method: 'POST' })
  .inputValidator(UpdateCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateCardQuery({ ...data, userId: context.uid }),
  );

export const deleteCard = createServerFn({ method: 'POST' })
  .inputValidator(DeleteCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteCardQuery({ ...data, userId: context.uid }),
  );
