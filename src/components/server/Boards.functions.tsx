import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { BoardsContainer } from '~/components/Boards/Boards.styled';
import { authMiddleware } from '~/middleware/auth';

export type BoardsServerProps = {
  children?: ReactNode;
};

/**
 * `useIsMobile` reads the router context, which a server component cannot do —
 * the same flag is handed to this function by the route loader instead.
 */
const IsMobileSchema = z.object({
  isMobile: z.boolean(),
});

export const getBoardsServer = createServerFn()
  .validator(IsMobileSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => ({
    src: await createCompositeComponent((props: BoardsServerProps) => {
      return (
        <BoardsContainer $isMobile={data.isMobile}>
          {props.children}
        </BoardsContainer>
      );
    }),
  }));
