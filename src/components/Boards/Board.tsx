import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import * as styles from '~/components/Boards/Boards.css';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import type { BoardBackground } from '~/styles/tokens';

export function Board({ boardId }: { boardId: string }) {
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  return (
    <Link
      className={styles.boardCardLink({
        background: board?.boardColor as BoardBackground,
      })}
      data-testid="BoardCardContainer"
      key={boardId}
      to="/board/$id"
      params={{ id: boardId }}
    >
      <div className={styles.boardCardTitle} data-testid="BoardCardTitle">
        {board?.boardTitle}
      </div>
    </Link>
  );
}
