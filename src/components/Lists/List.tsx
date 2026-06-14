import { useRef } from 'react';
import { Draggable } from '~/components/Draggable';
import { DropZone } from '~/components/DropZone';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { ListCard } from '~/components/Lists/ListCard';
import { ListHeader } from '~/components/Lists/ListHeader';
import {
  applyMoveCard,
  reorderCardsByIndex,
  useGetCardsByListId,
} from '~/query/cards';
import { useGetListById } from '~/query/lists';
import { afterCrossContainerDrop } from '~/utils/crossContainerDragDom';

export function List({ id: listId }: { id: string }) {
  // Ref on the card stack only (not the whole column). On cross-container drop the
  // dragged card's onMove runs in *this* list's Draggable — only the source list has
  // the correct container ref for reverting DOM before we update React Query.
  const sortableGroupRef = useRef<HTMLDivElement>(null);
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

      <div ref={sortableGroupRef} style={{ width: '100%', minWidth: 0 }}>
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
            onMove={(args) =>
              afterCrossContainerDrop({
                element: args.element,
                sourceContainer: sortableGroupRef.current,
                fromIndex: args.fromIndex,
                applyMove: () =>
                  applyMoveCard({
                    cardId: args.itemId,
                    sourceListId: args.sourceGroupId,
                    targetListId: args.targetGroupId,
                    targetIndex: args.toIndex,
                  }),
              })
            }
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
