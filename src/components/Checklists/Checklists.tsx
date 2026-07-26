import { Suspense } from 'react';
import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import * as styles from '~/components/Checklists/Checklists.css';
import { Draggable } from '~/components/shared/dnd/Draggable';
import { reorderChecklistsByIndex } from '~/db/checklists/checklists.cache';
import { useGetChecklists } from '~/db/checklists/checklists.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardChecklists() {
  const cardId = useCurrentCardId();
  const { data } = useGetChecklists({ cardId });

  return (
    <div
      className={styles.checklistsContainer}
      data-testid="ChecklistsContainer"
    >
      {data?.map((checklist, index) => (
        <Draggable
          key={checklist.id}
          id={checklist.id}
          name={checklist.checklistTitle}
          type="checklist"
          index={index}
          group={cardId}
          onReorder={(fromIndex, toIndex) =>
            reorderChecklistsByIndex(cardId, fromIndex, toIndex)
          }
        >
          <Suspense fallback={<ChecklistSkeleton />}>
            <Checklist id={checklist.id} />
          </Suspense>
        </Draggable>
      ))}
    </div>
  );
}
