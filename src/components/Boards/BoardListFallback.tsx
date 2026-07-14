import { BoardCardSkeleton } from '~/components/Boards/Boards.styled';

export function BoardListFallback() {
  return (['one', 'two', 'three'] as const).map((id) => (
    <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
  ));
}
