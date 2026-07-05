import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { activityListQueryOptions } from '~/db/activity/activity.query';
import { cardByIdQueryOptions } from '~/db/cards/cards.query';
import { checklistsQueryOptions } from '~/db/checklists/checklists.query';
import { authMiddleware } from '~/middleware/auth';
import { getQueryClient } from '~/query';

export type CardPageServerProps = {
  children?: ReactNode;
};

export const getCardServer = createServerFn()
  .validator(
    z.object({
      cardId: z.string(),
      boardId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(cardByIdQueryOptions(data.cardId));
    await queryClient.prefetchQuery(checklistsQueryOptions(data.cardId));
    await queryClient.prefetchQuery(activityListQueryOptions(data));
    const src = await createCompositeComponent((props: CardPageServerProps) => {
      return props.children;
    });

    return { src };
  });
