import { useEffect, useRef } from 'react';
import { AddChecklistItem } from '~/components/ChecklistItem/AddChecklistItem';
import { ChecklistItem } from '~/components/ChecklistItem/ChecklistItem';
import { ChecklistEditableTitle } from '~/components/Checklists/ChecklistEditableTitle';
import { ChecklistProgress } from '~/components/Checklists/ChecklistProgress';
import {
  ChecklistContainer,
  ChecklistHeader,
} from '~/components/Checklists/Checklists.styled';
import { DeleteChecklist } from '~/components/Checklists/DeleteChecklist';
import { Draggable } from '~/components/Draggable';
import type { ChecklistItem as ChecklistItemType } from '~/generated/prisma/client';
import {
  reorderChecklistItems,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useHashChecklistId } from '~/utils/useHashChecklistId';

export function Checklist({ id }: { id: string }) {
  const { isSuccess, data: checklist } = useGetChecklist({ checklistId: id });
  const { isSuccess: isItemsSuccess, data: items } = useGetChecklistItems({
    checklistId: id,
  });
  const hashId = useHashChecklistId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (hashId === id && isItemsSuccess && isSuccess) {
      timeoutId = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }

    return () => clearTimeout(timeoutId);
  }, [hashId, id, isSuccess, isItemsSuccess]);

  if (!checklist) return null;

  return (
    <ChecklistContainer data-testid="ChecklistContainer">
      <ChecklistHeader data-testid="ChecklistHeader" key={id} ref={ref}>
        <ChecklistEditableTitle id={id} />
        <DeleteChecklist id={id} />
      </ChecklistHeader>

      <ChecklistProgress checklistId={id} />

      {items?.map((checklistItem: ChecklistItemType) => (
        <Draggable
          key={checklistItem.id}
          id={checklistItem.id}
          name={checklistItem.label}
          type="checklistItem"
          onDrop={(item: ChecklistItemType) =>
            reorderChecklistItems(item, id, checklistItem.id)
          }
        >
          <ChecklistItem id={checklistItem.id} />
        </Draggable>
      ))}

      <AddChecklistItem checklistId={id} />
    </ChecklistContainer>
  );
}
