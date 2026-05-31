import { type CSSProperties, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import {
  CheckboxIndicator,
  CheckboxRoot,
  ChecklistCheckboxContainer,
  ChecklistCheckboxContentColumn,
  ChecklistLeadingColumn,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { DeleteChecklistItem } from '~/components/ChecklistItem/DeleteChecklistItem';
import { EditableChecklistLabel } from '~/components/ChecklistItem/EditableChecklistLabel';
import { useCreateActivity } from '~/query/activity';
import {
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/query/checklistItems';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const AiOutlineCheck = AiIcons.AiOutlineCheck;

export function ChecklistItem({ id }: { id: string }) {
  const boardId = useCurrentBoardId();
  const { data: checklistItem } = useGetChecklistItem({ itemId: id });
  const updateItem = useUpdateChecklistItem();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const createActivity = useCreateActivity();

  const checkIconStyles: CSSProperties = {
    position: 'absolute',
    top: '-1px',
    left: '0px',
  };

  function toggleCheckbox() {
    if (checklistItem) {
      updateItem({
        itemId: id,
        label: checklistItem.label,
        isCompleted: !checklistItem.isCompleted,
      });

      const contentNextState = checklistItem.isCompleted
        ? 'incomplete'
        : 'complete';

      createActivity({
        cardId: checklistItem.cardId,
        listId: checklistItem.listId,
        boardId,
        type: 'feed',
        content: `marked ${checklistItem.label} ${contentNextState} on this card`,
      });
    }
  }

  if (!checklistItem) return null;

  return (
    <ChecklistCheckboxContainer data-testid="ChecklistCheckboxContainer">
      <ChecklistLeadingColumn data-testid="ChecklistLeadingColumn">
        <CheckboxRoot
          data-testid="CheckboxRoot"
          isEditing={isEditingLabel}
          checked={checklistItem.isCompleted}
          onClick={toggleCheckbox}
        >
          <CheckboxIndicator data-testid="CheckboxIndicator">
            <AiOutlineCheck style={checkIconStyles} />
          </CheckboxIndicator>
        </CheckboxRoot>
      </ChecklistLeadingColumn>

      <ChecklistCheckboxContentColumn
        data-testid="ChecklistContentColumn"
        isHovering={isHovering && !isEditingLabel}
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        <EditableChecklistLabel
          id={id}
          isEditingLabel={isEditingLabel}
          setIsEditingLabel={setIsEditingLabel}
        />

        {!isEditingLabel && <DeleteChecklistItem id={id} />}
      </ChecklistCheckboxContentColumn>
    </ChecklistCheckboxContainer>
  );
}
