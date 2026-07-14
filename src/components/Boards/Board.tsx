import { useSuspenseQuery } from '@tanstack/react-query';
import {
  type BoardBackground,
  BoardCardLink,
  BoardCardTitle,
} from '~/components/Boards/Boards.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';

export function Board({ boardId }: { boardId: string }) {
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  return (
    <BoardCardLink
      data-testid="BoardCardContainer"
      key={boardId}
      background={board?.boardColor as BoardBackground}
      to={`/board/${boardId}`}
    >
      <BoardCardTitle data-testid="BoardCardTitle">
        {board?.boardTitle}
      </BoardCardTitle>
    </BoardCardLink>
  );
}
