import { useState } from 'react';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import {
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/db/checklistItems/checklistItems.query';

type EditableChecklistLabelProps = {
  id: string;
  checklistId: string;
  isEditingLabel: boolean;
  setIsEditingLabel: (isEditingLabel: boolean) => void;
};

export function EditableChecklistLabel({
  id,
  checklistId,
  isEditingLabel,
  setIsEditingLabel,
}: EditableChecklistLabelProps) {
  const { data: checklistItem } = useGetChecklistItem({
    itemId: id,
    checklistId,
  });
  const { mutate: updateItem } = useUpdateChecklistItem({ checklistId });
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
      <button
        type="button"
        className={checklistItemStyles.checkboxLabel({
          checked: checklistItem?.isCompleted ?? false,
        })}
        data-testid="CheckboxLabel"
        onClick={openEditLabel}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            openEditLabel();
          }
        }}
      >
        {checklistItem?.label}
      </button>
    );
  }

  return (
    <div
      className={checklistItemStyles.editChecklistItemContainer}
      data-testid="EditChecklistItemContainer"
    >
      <textarea
        className={checklistItemStyles.addChecklistItemInput}
        data-testid="AddChecklistItemInput"
        value={editedLabel}
        placeholder={editedLabel}
        onChange={(event) => setEditedLabel(event.target.value)}
      />

      <div
        className={checklistItemStyles.checklistItemActions}
        data-testid="ChecklistItemActions"
      >
        <button
          type="button"
          className={checklistItemStyles.addChecklistButton}
          data-testid="AddChecklistButton"
          onClick={addChecklistItem}
        >
          Save
        </button>

        <button
          type="button"
          className={cardStyles.closeDescriptionButton}
          data-testid="CloseDescriptionButton"
          onClick={() => setIsEditingLabel(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
