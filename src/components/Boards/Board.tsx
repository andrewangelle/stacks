import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardCardTitle,
} from '~/components/Boards/Boards.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';

export function Board({ boardId }: { boardId: string }) {
  const navigate = useNavigate();
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  return (
    <BoardCardContainer
      data-testid="BoardCardContainer"
      key={boardId}
      background={board?.boardColor as BoardBackground}
      onClick={() => navigate({ to: `/board/${boardId}` })}
    >
      <BoardCardTitle data-testid="BoardCardTitle">
        {board?.boardTitle}
      </BoardCardTitle>
    </BoardCardContainer>
  );
}
