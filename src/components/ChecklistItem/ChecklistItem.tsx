import { Checkbox } from 'radix-ui';
import { type CSSProperties, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import * as styles from '~/components/ChecklistItem/ChecklistItem.css';
import { ChecklistItemOptions } from '~/components/ChecklistItem/ChecklistItemOptions';
import { ChecklistItemSkeleton } from '~/components/ChecklistItem/ChecklistItemSkeleton';
import { EditableChecklistLabel } from '~/components/ChecklistItem/EditableChecklistLabel';
import { useCreateActivity } from '~/db/activity/activity.query';
import {
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/db/checklistItems/checklistItems.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useIsMobile } from '~/utils/useIsMobile';

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
  const { mutate: updateItem } = useUpdateChecklistItem({ checklistId });
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const createActivity = useCreateActivity();
  const isMobile = useIsMobile();

  const checkIconStyles: CSSProperties = {
    position: 'absolute',
    top: isMobile ? '0px' : '-1px',
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
    <div
      className={styles.checklistCheckboxContainer}
      data-testid="ChecklistCheckboxContainer"
    >
      <div
        className={styles.checklistLeadingColumn}
        data-testid="ChecklistLeadingColumn"
      >
        <Checkbox.Root
          className={styles.checkboxRoot({
            checked: checklistItem?.isCompleted,
          })}
          data-testid="CheckboxRoot"
          data-editing={isEditingLabel ? '' : undefined}
          checked={checklistItem?.isCompleted}
          onClick={toggleCheckbox}
        >
          <Checkbox.Indicator
            className={styles.checkboxIndicator}
            data-testid="CheckboxIndicator"
          >
            <AiOutlineCheck style={checkIconStyles} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: <Not sure on fix> */}
      {/* biome-ignore lint/a11y/useKeyWithMouseEvents: <Not needed> */}
      <div
        className={styles.checklistCheckboxContentColumn({
          isHovering: isHovering && !isEditingLabel,
        })}
        data-testid="ChecklistContentColumn"
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
      </div>
    </div>
  );
}
