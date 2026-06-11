import { useState } from 'react';
import { CloseDescriptionButton } from '~/components/Cards/Card.styled';
import {
  AddChecklistButton,
  AddChecklistItemInput,
  CheckboxLabel,
  ChecklistItemActions,
  EditChecklistItemContainer,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/query/checklistItems';

type EditableChecklistLabelProps = {
  id: string;
  isEditingLabel: boolean;
  setIsEditingLabel: (isEditingLabel: boolean) => void;
};

export function EditableChecklistLabel({
  id,
  isEditingLabel,
  setIsEditingLabel,
}: EditableChecklistLabelProps) {
  const { data: checklistItem } = useGetChecklistItem({ itemId: id });
  const updateItem = useUpdateChecklistItem();
  const [editedLabel, setEditedLabel] = useState(checklistItem?.label);

  function openEditLabel() {
    setIsEditingLabel(true);
    setEditedLabel(checklistItem?.label);
  }

  function addChecklistItem() {
    if (checklistItem) {
      updateItem({
        itemId: id,
        label: editedLabel ?? checklistItem.label,
        isCompleted: checklistItem.isCompleted,
      });
      setIsEditingLabel(false);
      setEditedLabel('');
    }
  }

  if (!isEditingLabel) {
    return (
      <CheckboxLabel
        tabIndex={0}
        data-testid="CheckboxLabel"
        checked={checklistItem?.isCompleted ?? false}
        onClick={openEditLabel}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            openEditLabel();
          }
        }}
      >
        {checklistItem?.label}
      </CheckboxLabel>
    );
  }

  return (
    <EditChecklistItemContainer data-testid="EditChecklistItemContainer">
      <AddChecklistItemInput
        data-testid="AddChecklistItemInput"
        value={editedLabel}
        placeholder={editedLabel}
        autoFocus
        onChange={(event) => setEditedLabel(event.target.value)}
      />

      <ChecklistItemActions data-testid="ChecklistItemActions">
        <AddChecklistButton
          data-testid="AddChecklistButton"
          onClick={addChecklistItem}
        >
          Save
        </AddChecklistButton>

        <CloseDescriptionButton
          data-testid="CloseDescriptionButton"
          secondary
          onClick={() => setIsEditingLabel(false)}
        >
          Cancel
        </CloseDescriptionButton>
      </ChecklistItemActions>
    </EditChecklistItemContainer>
  );
}
