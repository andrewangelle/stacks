import { Draggable } from '~/components/Draggable';
import { DropZone } from '~/components/DropZone';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListCard } from '~/components/Lists/ListCard';
import { ListHeader } from '~/components/Lists/ListHeader';
import { reorderCardsByIndex, useGetCardsByListId } from '~/query/cards';
import { useGetListById } from '~/query/lists';
import { useMoveCardToNewList } from '~/utils/dnd/useMoveCardToNewList';

export function List({ id: listId }: { id: string }) {
  const { ref, moveCardToNewList } = useMoveCardToNewList();
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
            onMove={moveCardToNewList}
          >
            <ListCard id={card.id} />
          </Draggable>
        ))}
      </div>

      {/* Append target when dropping below the last card — see DropZone.tsx */}
      <DropZone id={`list-drop:${listId}`} type="card" />

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
