import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import * as styles from '~/components/Nav/Nav.css';
import { getBoardColor } from '~/db/boards/boards.functions';
import { GetBoardByIdSchema } from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';
import type { BoardBackground } from '~/styles/tokens';

export type BoardPageServerProps = {
  children?: ReactNode;
};

export const getBoardPageServer = createServerFn()
  .validator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => ({
    src: await createCompositeComponent(async (props: BoardPageServerProps) => {
      const response = await getBoardColor({ data });
      return (
        <div
          className={styles.boardPageBackground({
            background: response?.boardColor as BoardBackground,
          })}
          key={response?.boardColor}
          data-testid="BoardPageBackground"
        >
          {props.children}
        </div>
      );
    }),
  }));
