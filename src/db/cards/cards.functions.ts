import { createServerFn } from '@tanstack/react-start';
import {
  CreateCardSchema,
  DeleteCardSchema,
  GetCardByIdSchema,
  GetCardsByListIdSchema,
  MoveCardSchema,
  ReorderCardsSchema,
  SetCardChecklistExpandedSchema,
  UpdateCardSchema,
} from '~/db/cards/cards.schemas';
import {
  createCardQuery,
  deleteCardQuery,
  getBoardIdByCardIdQuery,
  getCardByIdQuery,
  getCardsByListIdQuery,
  moveCardQuery,
  reorderCardsQuery,
  setCardChecklistExpandedQuery,
  updateCardQuery,
} from '~/db/cards/cards.server';
import { authMiddleware } from '~/middleware/auth';

export const getCardsByListId = createServerFn({ method: 'GET' })
  .validator(GetCardsByListIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getCardsByListIdQuery({ ...data, userId: context.uid }),
  );

export const getCardById = createServerFn({ method: 'GET' })
  .validator(GetCardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getCardByIdQuery({ ...data, userId: context.uid }),
  );

export const getBoardIdByCardId = createServerFn({ method: 'GET' })
  .validator(GetCardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getBoardIdByCardIdQuery({ ...data, userId: context.uid }),
  );

export const createCard = createServerFn({ method: 'POST' })
  .validator(CreateCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    createCardQuery({ ...data, userId: context.uid }),
  );

export const updateCard = createServerFn({ method: 'POST' })
  .validator(UpdateCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    updateCardQuery({ ...data, userId: context.uid }),
  );

export const setCardChecklistExpanded = createServerFn({ method: 'POST' })
  .validator(SetCardChecklistExpandedSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    setCardChecklistExpandedQuery({ ...data, userId: context.uid }),
  );

export const deleteCard = createServerFn({ method: 'POST' })
  .validator(DeleteCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    deleteCardQuery({ ...data, userId: context.uid }),
  );

export const reorderCards = createServerFn({ method: 'POST' })
  .validator(ReorderCardsSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    reorderCardsQuery({ ...data, userId: context.uid }),
  );

export const moveCard = createServerFn({ method: 'POST' })
  .validator(MoveCardSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    moveCardQuery({ ...data, userId: context.uid }),
  );
