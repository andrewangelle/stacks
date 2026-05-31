import type { Card } from '@prisma/client';
import { CardModal } from '~/components/Cards/CardModal';
import { Draggable } from '~/components/Draggable';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListHeader } from '~/components/Lists/ListHeader';
import { reorderCards, useGetCardsByListId } from '~/query/cards';
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
        <Draggable
          key={card.id}
          id={card.id}
          name={card.cardTitle}
          type="card"
          onDrop={(item: Card) => reorderCards(item, card.listId, card.id)}
        >
          <CardModal id={card.id} />
        </Draggable>
      ))}

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
