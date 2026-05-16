import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateActivityRequestMiddleware =
  createMiddleware().server(async ({ next, request }) => {
    const body = await request.clone().json();

    if (
      !body?.listId ||
      !body?.cardId ||
      !body?.boardId ||
      !body?.content ||
      !body?.type
    ) {
      return data(
        {
          code: 'activity:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        listId: body.listId,
        cardId: body.cardId,
        boardId: body.boardId,
        content: body.content,
        type: body.type,
      },
    });
  });

export const validateUpdateActivityRequestMiddleware =
  createMiddleware().server(async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.content) {
      return data(
        { message: 'Bad Request' },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        content: body.content,
      },
    });
  });
