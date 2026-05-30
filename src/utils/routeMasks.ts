import { createRouteMask } from '@tanstack/react-router';
import { routeTree } from '~/routeTree.gen';

export const boardIDMask = createRouteMask({
  routeTree,
  from: '/board/$id',
  to: '/board/$id',
  params: (prev) => ({
    id: prev?.id?.slice(0, 8) ?? '',
  }),
});
