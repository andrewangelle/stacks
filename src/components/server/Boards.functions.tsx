import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { BoardsContainer } from '~/components/Boards/Boards.styled';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { authMiddleware } from '~/middleware/auth';
import { getQueryClient } from '~/query';

export type BoardsServerProps = {
  children?: ReactNode;
};

export const getBoardsServer = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(boardsQueryOptions);

    const src = await createCompositeComponent((props: BoardsServerProps) => {
      return (
        <BoardsContainer data-testid="BoardsContainer">
          {props.children}
        </BoardsContainer>
      );
    });

    return { src };
  });
