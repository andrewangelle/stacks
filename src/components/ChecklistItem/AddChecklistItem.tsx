import { useState } from 'react';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
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
        <button
          type="button"
          className={checklistItemStyles.addChecklistItemButton}
          data-testid="AddChecklistItemButton"
          onClick={() => setIsEditing(true)}
        >
          Add an item
        </button>
      )}

      {isEditing && (
        <div className={checklistItemStyles.editChecklistItemContainer}>
          <textarea
            className={checklistItemStyles.addChecklistItemInputIndented}
            data-testid="AddChecklistItemInput"
            value={label}
            placeholder={'Add an item'}
            onChange={(event) => setLabel(event.target.value)}
          />

          <div
            className={checklistItemStyles.checklistItemActionsIndented}
            data-testid="ChecklistItemActions"
          >
            <button
              type="button"
              className={checklistItemStyles.addChecklistButton}
              data-testid="AddChecklistButton"
              onClick={createItem}
            >
              Add
            </button>

            <button
              type="button"
              className={cardStyles.closeDescriptionButton}
              data-testid="CloseDescriptionButton"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
