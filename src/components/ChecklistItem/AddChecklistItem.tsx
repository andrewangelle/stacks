import { useState } from 'react';
import { CloseDescriptionButton } from '~/components/Cards/CardModal.styled';
import {
  AddChecklistButton,
  AddChecklistItemButton,
  AddChecklistItemInputIndented,
  ChecklistItemActionsIndented,
  EditChecklistItemContainer,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { useCreateChecklistItem } from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';

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
        <AddChecklistItemButton
          data-testid="AddChecklistItemButton"
          secondary
          onClick={() => setIsEditing(true)}
        >
          Add an item
        </AddChecklistItemButton>
      )}

      {isEditing && (
        <EditChecklistItemContainer>
          <AddChecklistItemInputIndented
            data-testid="AddChecklistItemInput"
            value={label}
            placeholder={'Add an item'}
            autoFocus
            onChange={(event) => setLabel(event.target.value)}
          />

          <ChecklistItemActionsIndented data-testid="ChecklistItemActions">
            <AddChecklistButton
              data-testid="AddChecklistButton"
              onClick={createItem}
            >
              Add
            </AddChecklistButton>

            <CloseDescriptionButton
              data-testid="CloseDescriptionButton"
              secondary
              onClick={() => setIsEditing(false)}
            >
              X
            </CloseDescriptionButton>
          </ChecklistItemActionsIndented>
        </EditChecklistItemContainer>
      )}
    </>
  );
}
