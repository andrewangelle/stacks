import { type CSSProperties, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  CheckboxIndicator,
  CheckboxRoot,
  ChecklistCheckboxContainer,
  ChecklistCheckboxContentColumn,
  ChecklistLeadingColumn,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistItemOptions } from '~/components/ChecklistItem/ChecklistItemOptions';
import { ChecklistItemSkeleton } from '~/components/ChecklistItem/ChecklistItemSkeleton';
import { EditableChecklistLabel } from '~/components/ChecklistItem/EditableChecklistLabel';
import { useCreateActivity } from '~/db/activity/activity.query';
import {
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/db/checklistItems/checklistItems.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function ChecklistItem({
  id,
  checklistId,
}: {
  id: string;
  checklistId: string;
}) {
  const boardId = useCurrentBoardId();
  const {
    isLoading,
    data: checklistItem,
    isFetching,
    isRefetching,
  } = useGetChecklistItem({
    itemId: id,
    checklistId,
  });
  const { mutate: updateItem } = useUpdateChecklistItem();
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

      const content = checklistItem.isCompleted
        ? `marked ${checklistItem.label} incomplete on this card`
        : `completed ${checklistItem.label} on this card`;

      createActivity({
        cardId: checklistItem.cardId,
        listId: checklistItem.listId,
        boardId,
        type: 'feed',
        content,
      });
    }
  }

  if (isLoading || isFetching || isRefetching) {
    return <ChecklistItemSkeleton />;
  }

  return (
    <ChecklistCheckboxContainer data-testid="ChecklistCheckboxContainer">
      <ChecklistLeadingColumn data-testid="ChecklistLeadingColumn">
        <CheckboxRoot
          data-testid="CheckboxRoot"
          data-editing={isEditingLabel ? '' : undefined}
          checked={checklistItem?.isCompleted}
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
          checklistId={checklistId}
          isEditingLabel={isEditingLabel}
          setIsEditingLabel={setIsEditingLabel}
        />

        {!isEditingLabel && (
          <ChecklistItemOptions
            id={id}
            checklistId={checklistId}
            isHovering={isHovering}
          />
        )}
      </ChecklistCheckboxContentColumn>
    </ChecklistCheckboxContainer>
  );
}
