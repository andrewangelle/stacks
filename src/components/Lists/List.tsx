import { Draggable } from '~/components/dnd/Draggable';
import { DropTargetFallback } from '~/components/dnd/DropTargetFallback';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListCard } from '~/components/Lists/ListCard';
import { ListHeader } from '~/components/Lists/ListHeader';
import {
  moveCardToNewList,
  reorderCardsByIndex,
  useGetCardsByListId,
} from '~/query/cards';
import { useGetListById } from '~/query/lists';
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
        {cards?.map((card, index) => (
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
            <ListCard id={card.id} />
          </Draggable>
        ))}
      </div>

      <DropTargetFallback id={`list-drop:${listId}`} type="card" />

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
