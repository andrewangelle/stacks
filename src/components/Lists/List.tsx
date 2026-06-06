import { Card } from '~/components/Cards/Card';
import { Draggable } from '~/components/Draggable';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListHeader } from '~/components/Lists/ListHeader';
import type { Card as CardType } from '~/generated/prisma/client';
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
          onDrop={(item: CardType) => reorderCards(item, listId, card.id)}
        >
          <Card id={card.id} />
        </Draggable>
      ))}

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
