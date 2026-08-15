import { BoardCardSkeleton } from '~/components/Boards/Boards.styled';
import { useIsMobile } from '~/utils/useIsMobile';

export function BoardListFallback() {
  const isMobile = useIsMobile();

  return (['one', 'two', 'three'] as const).map((id) => (
    <BoardCardSkeleton key={id} $isMobile={isMobile} />
  ));
}
