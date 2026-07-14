import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import {
  BoardHeaderContainer,
  NavBarContent,
} from '~/components/Nav/Nav.styled';
import { getBoardColor } from '~/db/boards/boards.functions';
import {
  GetBoardByIdSchema,
  MaybeBoardIdSchema,
} from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';

export type NavServerProps = {
  children?: ReactNode;
};

export const getNavBarServer = createServerFn()
  .validator(MaybeBoardIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => ({
    src: await createCompositeComponent(async (props: NavServerProps) => {
      let boardColor: BoardBackground = 'blue';

      if (data.boardId) {
        const response = await getBoardColor({
          data: { boardId: data.boardId },
        });
        boardColor = response?.boardColor as BoardBackground;
      }

      return (
        <NavBarContent
          key={boardColor}
          data-testid="NavBarContent"
          background={boardColor}
        >
          {props.children}
        </NavBarContent>
      );
    }),
  }));

export type BoardBarServerProps = {
  children?: ReactNode;
};

export const getBoardHeaderServer = createServerFn()
  .validator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => ({
    src: await createCompositeComponent(async (props: BoardBarServerProps) => {
      const response = await getBoardColor({ data });
      return (
        <BoardHeaderContainer
          key={response?.boardColor}
          background={response?.boardColor as BoardBackground}
          data-testid="BoardHeaderContainer"
        >
          {props.children}
        </BoardHeaderContainer>
      );
    }),
  }));
