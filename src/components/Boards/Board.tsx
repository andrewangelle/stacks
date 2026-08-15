import { useSuspenseQuery } from '@tanstack/react-query';
import {
  type BoardBackground,
  BoardCardLink,
  BoardCardTitle,
  BoardColorSwatch,
} from '~/components/Boards/Boards.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { useIsMobile } from '~/utils/useIsMobile';

export function Board({ boardId }: { boardId: string }) {
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  const isMobile = useIsMobile();
  const background = board?.boardColor as BoardBackground;

  return (
    <BoardCardLink
      key={boardId}
      $background={background}
      $isMobile={isMobile}
      to={`/board/${boardId}`}
    >
      {isMobile && <BoardColorSwatch $background={background} />}
      <BoardCardTitle $isMobile={isMobile}>{board?.boardTitle}</BoardCardTitle>
    </BoardCardLink>
  );
}
