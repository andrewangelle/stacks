import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import * as styles from '~/components/Nav/Nav.css';
import { getBoardColor } from '~/db/boards/boards.functions';
import {
  GetBoardByIdSchema,
  MaybeBoardIdSchema,
} from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';
import type { BoardBackground } from '~/styles/tokens';

export type NavServerProps = {
  children?: ReactNode;
};

export const getNavBarServer = createServerFn()
  .validator(MaybeBoardIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => ({
    src: await createCompositeComponent(async (props: NavServerProps) => {
      let boardColor: BoardBackground = 'blue';

      if (data?.boardId) {
        const response = await getBoardColor({
          data: { boardId: data.boardId },
        });
        boardColor = response?.boardColor as BoardBackground;
      }

      return (
        <div
          className={styles.navBarContent({ background: boardColor })}
          key={boardColor}
          data-testid="NavBarContent"
        >
          {props.children}
        </div>
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
        <div
          className={styles.boardHeaderContainer({
            background: response?.boardColor as BoardBackground,
          })}
          key={response?.boardColor}
          data-testid="BoardHeaderContainer"
        >
          {props.children}
        </div>
      );
    }),
  }));
