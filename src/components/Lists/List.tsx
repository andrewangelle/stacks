import { AddNewCard } from '~/components/Lists/AddNewCard';
import { AddNewCardAtPosition } from '~/components/Lists/AddNewCardAtPosition';
import { CardTitleDetails } from '~/components/Lists/CardTitleDetails/CardTitleDetails';
import {
  ListContainer,
  ListContentContainer,
} from '~/components/Lists/List.styled';
import { ListHeader } from '~/components/Lists/ListHeader';
import { Draggable } from '~/components/shared/dnd/Draggable';
import { DropTargetFallback } from '~/components/shared/dnd/DropTargetFallback';
import { moveCardToNewList, reorderCardsByIndex } from '~/db/cards/cards.cache';
import { useGetListById } from '~/db/lists/lists.query';
import { useCrossContainerMove } from '~/hooks/useCrossContainerMove';
import { useIsMobile } from '~/hooks/useIsMobile';
import { ListIdProvider } from '~/hooks/useListId';

type ListProps = {
  id: string;
};

export function List({ id: listId }: ListProps) {
  const { ref, onMove } = useCrossContainerMove((args) => {
    moveCardToNewList({
      cardId: args.itemId,
      sourceListId: args.sourceGroupId,
      targetListId: args.targetGroupId,
      targetIndex: args.toIndex,
    });
  });
  const { data: list } = useGetListById({ id: listId });
  const isMobile = useIsMobile();

  return (
    <ListIdProvider listId={listId}>
      <ListContainer key={listId} $isMobile={isMobile}>
        <ListHeader />

        <ListContentContainer ref={ref}>
          {list?.cards?.map((card, index) => {
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
                {index === 0 && <AddNewCardAtPosition position={-1} />}

                <CardTitleDetails id={card.id} />

                {index !== list?.cards?.length - 1 && (
                  <AddNewCardAtPosition position={index} />
                )}
              </Draggable>
            );
          })}
        </ListContentContainer>

        <DropTargetFallback id={`list-drop:${listId}`} type="card" />

        <AddNewCard />
      </ListContainer>
    </ListIdProvider>
  );
}
