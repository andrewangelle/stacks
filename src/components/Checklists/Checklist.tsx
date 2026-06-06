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

export function Checklist({ id }: { id: string }) {
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const { data } = useGetChecklistItems({ checklistId: id });

  if (!checklist) return null;

  return (
    <ChecklistContainer data-testid="ChecklistContainer">
      <ChecklistHeader data-testid="ChecklistHeader" key={id}>
        <ChecklistEditableTitle id={id} />
        <DeleteChecklist id={id} />
      </ChecklistHeader>

      <ChecklistProgress checklistId={id} />

      {data?.map((checklistItem: ChecklistItemType) => (
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
