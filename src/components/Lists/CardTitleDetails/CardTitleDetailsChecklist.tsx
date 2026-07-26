import { Checkbox } from 'radix-ui';
import { type MouseEvent, useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import * as styles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useUpdateChecklistItem } from '~/db/checklistItems/checklistItems.query';
import { useGetChecklist } from '~/db/checklists/checklists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const INITIAL_VISIBLE = 3;
const STEP = 2;

type CardTitleDetailsChecklistProps = {
  checklistId: string;
  isSingleView?: boolean;
  collapsible?: boolean;
  onCompleteAllItems?: () => void;
};

export function CardTitleDetailsChecklist({
  checklistId,
  collapsible = false,
  isSingleView = false,
  onCompleteAllItems = () => null,
}: CardTitleDetailsChecklistProps) {
  const { data: checklist } = useGetChecklist({ checklistId });
  const { mutate: updateItem } = useUpdateChecklistItem({
    checklistId,
  });
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [completedAllItems, setCompletedAllItems] = useState(false);

  const incompleteItems =
    checklist?.items?.filter((item) => !item.isCompleted) ?? [];
  const visibleItems = incompleteItems.slice(0, visibleCount);
  const hasMore = collapsible && visibleCount < incompleteItems.length;

  function showMore(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setVisibleCount((prev) => Math.min(prev + STEP, incompleteItems.length));
  }

  function completeItem({ itemId, label }: { itemId: string; label: string }) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isSingleView && visibleItems.length === 1) {
        setCompletedAllItems(true);
      }

      updateItem({
        itemId,
        label,
        isCompleted: true,
      });

      createActivity({
        cardId: checklist?.cardId ?? '',
        listId: checklist?.listId ?? '',
        boardId,
        type: 'feed',
        content: `marked ${label} complete on this card`,
      });
    };
  }

  useEffect(() => {
    if (completedAllItems) {
      onCompleteAllItems();
    }
  }, [completedAllItems, onCompleteAllItems]);

  return (
    <div
      className={styles.cardTitleDetailsChecklistContainer}
      data-testid="CardTitleDetailsChecklistContainer"
    >
      {visibleItems.map((item) => (
        <div
          className={styles.cardTitleDetailsChecklistItemRow}
          data-testid="CardTitleDetailsChecklistItemRow"
          key={item.id}
        >
          <Checkbox.Root
            className={styles.cardTitleDetailsChecklistCheckbox({
              checked: false,
            })}
            checked={false}
            data-testid="CardTitleDetailsChecklistCheckbox"
            onClick={completeItem({ itemId: item.id, label: item.label })}
          >
            <Checkbox.Indicator
              className={styles.cardTitleDetailsChecklistCheckboxIndicator}
              data-testid="CardTitleDetailsChecklistCheckboxIndicator"
            >
              <AiOutlineCheck size={12} />
            </Checkbox.Indicator>
          </Checkbox.Root>

          <span
            className={styles.cardTitleDetailsChecklistItemLabel}
            data-testid="CardTitleDetailsChecklistItemLabel"
          >
            {item.label}
          </span>
        </div>
      ))}

      {hasMore && (
        <button
          className={styles.cardTitleDetailsChecklistShowMore}
          data-testid="CardTitleDetailsChecklistShowMore"
          onClick={showMore}
          type="button"
        >
          Show more
        </button>
      )}
    </div>
  );
}
