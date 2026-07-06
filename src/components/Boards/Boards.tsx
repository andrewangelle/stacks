import { useSuspenseQuery } from '@tanstack/react-query';
import { Board } from '~/components/Boards/Board';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { DehydrateQueryClient } from '~/query';

export function Boards() {
  const { data: boards } = useSuspenseQuery(boardsQueryOptions);

  return (
    <DehydrateQueryClient>
      {boards.map((board) => (
        <Board key={board.id} boardId={board.id} />
      ))}
      <CreateBoard />
    </DehydrateQueryClient>
  );
}
