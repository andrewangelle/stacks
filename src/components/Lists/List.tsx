import { Draggable } from '~/components/dnd/Draggable';
import { DropTargetFallback } from '~/components/dnd/DropTargetFallback';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import { AddNewCardAtPosition } from '~/components/Lists/AddNewCardAtPosition';
import { CardTitleDetails } from '~/components/Lists/CardTitleDetails/CardTitleDetails';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListHeader } from '~/components/Lists/ListHeader';
import {
  moveCardToNewList,
  reorderCardsByIndex,
  useGetCardsByListId,
} from '~/db/cards/cards.query';
import { useGetListById } from '~/db/lists/lists.query';
import { useCrossContainerMove } from '~/utils/useCrossContainerMove';

export function List({ id: listId }: { id: string }) {
  const { ref, onMove } = useCrossContainerMove((args) => {
    moveCardToNewList({
      cardId: args.itemId,
      sourceListId: args.sourceGroupId,
      targetListId: args.targetGroupId,
      targetIndex: args.toIndex,
    });
  });
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

      <div ref={ref} style={{ width: '100%', minWidth: 0 }}>
        {cards?.map((card, index, cards) => {
          return (
            <Draggable
              key={card.id}
              id={card.id}
              name={card.cardTitle}
              type="card"
              parentId={listId}
              index={index}
              group={listId}
              onReorder={(fromIndex, toIndex) =>
                reorderCardsByIndex(listId, fromIndex, toIndex)
              }
              onMove={onMove}
            >
              <CardTitleDetails id={card.id} />

              {index !== cards.length - 1 && (
                <AddNewCardAtPosition listId={listId} position={index} />
              )}
            </Draggable>
          );
        })}
      </div>

      <DropTargetFallback id={`list-drop:${listId}`} type="card" />

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
