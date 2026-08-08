import { useState } from 'react';
import { CloseDescriptionButton } from '~/components/Cards/Card.styled';
import {
  AddChecklistButton,
  AddChecklistItemButton,
  AddChecklistItemInputIndented,
  ChecklistItemActionsIndented,
  EditChecklistItemContainer,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { useCreateChecklistItem } from '~/db/checklistItems/checklistItems.query';
import { useGetChecklist } from '~/db/checklists/checklists.query';

export function AddChecklistItem({ checklistId }: { checklistId: string }) {
  const { data: checklist } = useGetChecklist({ checklistId });
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const createChecklistItem = useCreateChecklistItem();

  function createItem() {
    createChecklistItem({
      label,
      cardId: checklist?.cardId ?? '',
      checklistId,
      listId: checklist?.listId ?? '',
    });
    setIsEditing(false);
    setLabel('');
  }

  return (
    <>
      {!isEditing && (
        <AddChecklistItemButton $secondary onClick={() => setIsEditing(true)}>
          Add an item
        </AddChecklistItemButton>
      )}

      {isEditing && (
        <EditChecklistItemContainer>
          <AddChecklistItemInputIndented
            value={label}
            placeholder={'Add an item'}
            autoFocus
            onChange={(event) => setLabel(event.target.value)}
          />

          <ChecklistItemActionsIndented>
            <AddChecklistButton onClick={createItem}>Add</AddChecklistButton>

            <CloseDescriptionButton
              $secondary
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </CloseDescriptionButton>
          </ChecklistItemActionsIndented>
        </EditChecklistItemContainer>
      )}
    </>
  );
}
