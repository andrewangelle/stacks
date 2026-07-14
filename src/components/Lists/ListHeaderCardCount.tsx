import { Tooltip } from '~/components/Tooltip/Tooltip';
import { useGetListCardCount } from '~/db/lists/lists.query';

export function ListHeaderCardCount({ listId }: { listId: string }) {
  const { data: cardCount } = useGetListCardCount({ listId });

  return (
    <div
      data-testid="ListHeaderCardCount"
      style={{ color: 'rgba(0,0,0, 0.7)', cursor: 'default' }}
    >
      <Tooltip content="Total cards">
        <span>{cardCount}</span>
      </Tooltip>
    </div>
  );
}
