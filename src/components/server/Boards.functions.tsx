import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { BoardsContainer } from '~/components/Boards/Boards.styled';
import { authMiddleware } from '~/middleware/auth';

export type BoardsServerProps = {
  children?: ReactNode;
};

export const getBoardsServer = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => ({
    src: await createCompositeComponent((props: BoardsServerProps) => {
      return (
        <BoardsContainer data-testid="BoardsContainer">
          {props.children}
        </BoardsContainer>
      );
    }),
  }));
