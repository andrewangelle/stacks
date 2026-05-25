import { useLocation } from '@tanstack/react-router';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { useGetBoardQuery } from '~/query/boards';

export function useBoardBackgroundColor(): BoardBackground {
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

  return background as BoardBackground;
}
