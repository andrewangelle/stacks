import { AddNewCard } from '~/components/Lists/AddNewCard';
import { AddNewCardAtPosition } from '~/components/Lists/AddNewCardAtPosition';
import { CardTitleDetails } from '~/components/Lists/CardTitleDetails/CardTitleDetails';
import * as styles from '~/components/Lists/List.css';
import { ListHeader } from '~/components/Lists/ListHeader';
import { Draggable } from '~/components/shared/dnd/Draggable';
import { DropTargetFallback } from '~/components/shared/dnd/DropTargetFallback';
import { moveCardToNewList, reorderCardsByIndex } from '~/db/cards/cards.cache';
import { useGetListById } from '~/db/lists/lists.query';
import { useCrossContainerMove } from '~/utils/useCrossContainerMove';
import { useIsMobile } from '~/utils/useIsMobile';

export function List({ id: listId }: { id: string }) {
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
    <div
      className={styles.listContainer({ isMobile })}
      data-testid="ListContainer"
      key={listId}
    >
      <ListHeader id={listId} />

      <div
        className={styles.listContentContainer}
        ref={ref}
        data-testid="ListContentContainer"
      >
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
              {index === 0 && (
                <AddNewCardAtPosition listId={listId} position={-1} />
              )}

              <CardTitleDetails
                id={card.id}
                description={card.cardDescription}
                isCompleted={card.isCompleted}
                title={card.cardTitle}
              />

              {index !== list?.cards?.length - 1 && (
                <AddNewCardAtPosition listId={listId} position={index} />
              )}
            </Draggable>
          );
        })}
      </div>

      <DropTargetFallback id={`list-drop:${listId}`} type="card" />

      <AddNewCard listId={listId} />
    </div>
  );
}
