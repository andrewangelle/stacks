import { createMiddleware } from '@tanstack/react-start';
import { data } from '~/utils/response';

export const validateCreateCardRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.listId || !body?.cardTitle) {
      return data(
        {
          code: 'cards:create:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        listId: body.listId,
        cardTitle: body.cardTitle,
      },
    });
  },
);

export const validateUpdateCardRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.cardDescription && !body?.cardTitle) {
      return data(
        {
          code: 'cards:update:error',
          message: 'Missing required fields',
        },
        { status: 400, statusText: 'Bad Request' },
      );
    }

    return await next({
      context: {
        cardDescription: body.cardDescription,
        cardTitle: body.cardTitle,
      },
    });
  },
);

export const validateDeleteCardRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const body = await request.clone().json();

    if (!body?.id) {
      return data(
        {
          code: 'cards:delete:error',
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
