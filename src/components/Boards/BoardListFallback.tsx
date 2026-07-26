import * as styles from '~/components/Boards/Boards.css';

export function BoardListFallback() {
  return (['one', 'two', 'three'] as const).map((id) => (
    <div
      className={styles.boardCardSkeleton}
      data-testid="BoardCardSkeleton"
      key={id}
    />
  ));
}
