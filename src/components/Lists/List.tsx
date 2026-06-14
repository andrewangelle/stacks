import { Draggable } from '~/components/Draggable';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListCard } from '~/components/Lists/ListCard';
import { ListHeader } from '~/components/Lists/ListHeader';
import { reorderCardsByIndex, useGetCardsByListId } from '~/query/cards';
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

      {cards?.map((card, index) => (
        <Draggable
          key={card.id}
          id={card.id}
          name={card.cardTitle}
          type="card"
          index={index}
          group={listId}
          onReorder={(fromIndex, toIndex) =>
            reorderCardsByIndex(listId, fromIndex, toIndex)
          }
        >
          <ListCard id={card.id} />
        </Draggable>
      ))}

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
