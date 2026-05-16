import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateChecklistRequestMiddleware =
  createMiddleware().server(async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.cardId || !body?.listId || !body?.checklistTitle) {
      return data(
        {
          code: 'checklists:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        cardId: body.cardId,
        listId: body.listId,
        checklistTitle: body.checklistTitle,
      },
    });
  });
