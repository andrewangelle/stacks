import { BoardCardSkeleton } from '~/components/Boards/Boards.styled';
import { useIsMobile } from '~/hooks/useIsMobile';

export function BoardListFallback() {
  const isMobile = useIsMobile();

  return (['one', 'two', 'three'] as const).map((id) => (
    <BoardCardSkeleton key={id} $isMobile={isMobile} />
  ));
}
