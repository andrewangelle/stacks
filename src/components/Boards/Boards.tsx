import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Board } from '~/components/Boards/Board';
import { BoardCardSkeleton } from '~/components/Boards/Boards.styled';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { DehydrateQueryClient } from '~/query';

export function Boards() {
  const { data: boards } = useSuspenseQuery(boardsQueryOptions);

  return (
    <DehydrateQueryClient>
      {boards.map((board) => (
        <Suspense
          key={board.id}
          fallback={
            <BoardCardSkeleton data-testid="BoardCardSkeleton" key={board.id} />
          }
        >
          <Board key={board.id} boardId={board.id} />
        </Suspense>
      ))}
      <CreateBoard />
    </DehydrateQueryClient>
  );
}
