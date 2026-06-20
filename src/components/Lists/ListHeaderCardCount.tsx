import { useGetCardsByListId } from '~/db/cards/cards.query';

export function ListHeaderCardCount({ listId }: { listId: string }) {
  const { isSuccess, data: cards } = useGetCardsByListId({ listId });
  const cardCount = cards?.length || 0;

  if (isSuccess) {
    return (
      <div
        data-testid="ListHeaderCardCount"
        style={{ color: 'rgba(0,0,0, 0.7)' }}
      >
        {cardCount}{' '}
      </div>
    );
  }

  return null;
}
