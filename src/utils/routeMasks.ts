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

export const cardMask = createRouteMask({
  routeTree,
  from: '/board/$id/card/$cardId',
  to: '/card/$cardId',
  params: (prev) => ({
    cardId: prev.cardId?.slice(0, 8) ?? '',
  }),
});
