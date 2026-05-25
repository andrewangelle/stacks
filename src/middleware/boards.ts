import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateBoardRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.boardTitle || !body?.boardColor) {
      return data(
        {
          code: 'boards:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        boardTitle: body.boardTitle,
        boardColor: body.boardColor,
      },
    });
  },
);

export const validateUpdateBoardRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.boardTitle) {
      return data(
        {
          code: 'boards:update:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        boardTitle: body.boardTitle,
      },
    });
  },
);
