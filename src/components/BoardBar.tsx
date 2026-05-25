import { useLocation } from '@tanstack/react-router';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { useGetBoardQuery } from '~/query/boards';
import { BoardBarContainer } from '~/styles/Page.styled';

export function BoardBar() {
  const location = useLocation();
  const board = useGetBoardQuery();

  const boardBackground = board.data?.boardColor ?? 'blue';
  const onAuthPath = location.pathname.startsWith('/auth');
  const background =
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    onAuthPath
      ? 'blue'
      : boardBackground;

  return (
    <BoardBarContainer
      background={background as BoardBackground}
      data-testid="BoardBarContainer"
    >
      {board.data?.boardTitle}
    </BoardBarContainer>
  );
}
