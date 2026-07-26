import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import * as styles from '~/components/Boards/Boards.css';
import { authMiddleware } from '~/middleware/auth';

export type BoardsServerProps = {
  children?: ReactNode;
};

export const getBoardsServer = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => ({
    src: await createCompositeComponent((props: BoardsServerProps) => {
      return (
        <div className={styles.boardsContainer} data-testid="BoardsContainer">
          {props.children}
        </div>
      );
    }),
  }));
