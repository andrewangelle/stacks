import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateListRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.boardId || !body?.listTitle) {
      return data(
        {
          code: 'lists:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        boardId: body.boardId,
        listTitle: body.listTitle,
      },
    });
  },
);

export const validateUpdateListRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.listTitle) {
      return data(
        {
          code: 'lists:update:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        listTitle: body.listTitle,
      },
    });
  },
);

export const validateDeleteListRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.id) {
      return data(
        {
          code: 'lists:delete:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        id: body.id,
      },
    });
  },
);
