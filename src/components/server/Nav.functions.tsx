import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { z } from 'zod';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import {
  BoardHeaderContainer,
  NavBarContainer,
  NavBarContent,
} from '~/components/Nav/Nav.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { MaybeBoardIdSchema } from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';
import { queryClient } from '~/query';

export type NavServerProps = {
  boardColor: BoardBackground;
  renderUserContent: () => ReactNode;
  children?: ReactNode;
};

export const getNavBarServer = createServerFn()
  .validator(MaybeBoardIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const src = await createCompositeComponent((props: NavServerProps) => {
      return (
        <NavBarContainer data-testid="NavBarContainer">
          <NavBarContent
            key={data?.boardColor ?? props.boardColor}
            data-testid="NavBarContent"
            background={data.boardColor as BoardBackground}
          >
            {props.renderUserContent()}
          </NavBarContent>
          {props.children}
        </NavBarContainer>
      );
    });

    return { src };
  });

export type BoardBarServerProps = {
  children?: ReactNode;
};

export const getBoardHeaderServer = createServerFn()
  .validator(
    z.object({
      boardId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const board = await queryClient.ensureQueryData(
      boardByIdQueryOptions(data.boardId),
    );

    const src = await createCompositeComponent((props: BoardBarServerProps) => {
      return (
        <BoardHeaderContainer
          key={board?.boardColor}
          background={board?.boardColor as BoardBackground}
          data-testid="BoardHeaderContainer"
        >
          {props.children}
        </BoardHeaderContainer>
      );
    });

    return { src };
  });
