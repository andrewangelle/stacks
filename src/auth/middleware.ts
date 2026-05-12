import { createMiddleware } from '@tanstack/react-start';
import { requireAuthenticatedUser } from '~/auth/requireAuthenticatedUser';
import { data } from '~/utils/response';

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const auth = await requireAuthenticatedUser(request);

    if (auth instanceof Response) {
      return data({ message: 'Unauthorized' }, 401);
    }

    return await next({
      context: {
        uid: auth.uid,
      },
    });
  },
);
