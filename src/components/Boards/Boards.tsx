import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Board } from '~/components/Boards/Board';
import * as styles from '~/components/Boards/Boards.css';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { boardsQueryOptions } from '~/db/boards/boards.query';

export function Boards() {
  const { data: boards } = useSuspenseQuery(boardsQueryOptions);

  return (
    <>
      {boards.map((board) => (
        <Suspense
          key={board.id}
          fallback={
            <div
              className={styles.boardCardSkeleton}
              data-testid="BoardCardSkeleton"
              key={board.id}
            />
          }
        >
          <Board key={board.id} boardId={board.id} />
        </Suspense>
      ))}
      <CreateBoard />
    </>
  );
}
