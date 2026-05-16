import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateChecklistItemRequestMiddleware =
  createMiddleware().server(async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.cardId || !body?.checklistId || !body?.listId || !body?.label) {
      return data(
        {
          code: 'checklist-items:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        cardId: body.cardId,
        checklistId: body.checklistId,
        listId: body.listId,
        label: body.label,
      },
    });
  });

export const validateUpdateChecklistItemRequestMiddleware =
  createMiddleware().server(async ({ next, request }) => {
    const body = await request.clone().json();

    if (
      typeof body?.label !== 'string' &&
      typeof body?.isCompleted !== 'boolean'
    ) {
      return data(
        {
          code: 'checklist-items:update:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        label: body.label,
        isCompleted: body.isCompleted,
      },
    });
  });
