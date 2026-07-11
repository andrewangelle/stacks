import { Suspense } from 'react';
import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { Draggable } from '~/components/dnd/Draggable';
import {
  reorderChecklistsByIndex,
  useGetChecklists,
} from '~/db/checklists/checklists.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { ChecklistSkeleton } from './ChecklistSkeleton';

export function CardChecklists() {
  const cardId = useCurrentCardId();
  const { data } = useGetChecklists({ cardId });

  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
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
    </ChecklistsContainer>
  );
}
