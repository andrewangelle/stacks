import { CardModal } from '~/components/Cards/CardModal';
import { DragDropCard } from '~/components/Cards/DragDropCard';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListHeader } from '~/components/Lists/ListHeader';
import { useGetCardsByListId } from '~/query/cards';
import { useGetListById } from '~/query/lists';

export function List({ id: listId }: { id: string }) {
  const { isLoading } = useGetListById({ id: listId });
  const { data: cards } = useGetCardsByListId({
    listId,
  });

  if (isLoading) {
    return (
      <ListContainer data-testid="ListContainer" key={listId}>
        <ListCardSkeleton />
      </ListContainer>
    );
  }

  return (
    <ListContainer data-testid="ListContainer" key={listId}>
      <ListHeader id={listId} />

      {cards?.map((card) => (
        <DragDropCard key={card.id} id={card.id}>
          <CardModal id={card.id} />
        </DragDropCard>
      ))}

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
