import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useGetListCardCount } from '~/db/lists/lists.query';
import { useListId } from '~/hooks/useListId';

export function ListHeaderCardCount() {
  const listId = useListId();
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
