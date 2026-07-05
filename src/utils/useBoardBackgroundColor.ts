import { useLocation } from '@tanstack/react-router';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { useGetBoard } from '~/db/boards/boards.query';

export function useBoardBackgroundColor(): BoardBackground {
  const location = useLocation();
  const board = useGetBoard();

  const shouldUseDefault =
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    location.pathname.startsWith('/auth');

  if (shouldUseDefault) {
    return 'blue';
  }

  if (board.data) {
    return board.data.boardColor as BoardBackground;
  }

  return 'blue';
}
