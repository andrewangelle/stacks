import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { authMiddleware } from '~/middleware/auth';

export type CardPageServerProps = {
  children?: ReactNode;
};

// Data prefetching happens in the route loaders (via `context.queryClient`) so
// it reaches the client that the SSR query integration dehydrates. Prefetching
// here would land in an isolated server-function query client and be discarded.
export const getCardServer = createServerFn()
  .validator(
    z.object({
      cardId: z.string(),
      boardId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async () => {
    const src = await createCompositeComponent((props: CardPageServerProps) => {
      return props.children;
    });

    return { src };
  });
