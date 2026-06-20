import { useGetCardsByListId } from '~/db/cards/cards.query';
import { Tooltip } from '../Tooltip/Tooltip';

export function ListHeaderCardCount({ listId }: { listId: string }) {
  const { isSuccess, data: cards } = useGetCardsByListId({ listId });
  const cardCount = cards?.length || 0;

  if (isSuccess) {
    return (
      <div
        data-testid="ListHeaderCardCount"
        style={{ color: 'rgba(0,0,0, 0.7)', cursor: 'default' }}
      >
        <Tooltip trigger={<span>{cardCount}</span>}>Total cards</Tooltip>
      </div>
    );
  }

  return null;
}
