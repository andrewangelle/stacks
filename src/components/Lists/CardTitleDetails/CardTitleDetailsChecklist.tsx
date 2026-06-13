import { type MouseEvent, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  CheckboxSkeleton,
  ChecklistLabelSkeleton,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistItemSkeleton } from '~/components/ChecklistItem/ChecklistItemSkeleton';
import {
  CardTitleDetailsChecklistCheckbox,
  CardTitleDetailsChecklistCheckboxIndicator,
  CardTitleDetailsChecklistContainer,
  CardTitleDetailsChecklistItemLabel,
  CardTitleDetailsChecklistItemRow,
  CardTitleDetailsChecklistShowMore,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { useCreateActivity } from '~/query/activity';
import {
  useGetChecklistItems,
  useUpdateChecklistItem,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const INITIAL_VISIBLE = 3;
const STEP = 2;

type CardTitleDetailsChecklistProps = {
  checklistId: string;
  collapsible?: boolean;
};

export function CardTitleDetailsChecklist({
  checklistId,
  collapsible = false,
}: CardTitleDetailsChecklistProps) {
  const { isLoading, data: checklist } = useGetChecklist({ checklistId });
  const { isLoading: isItemsLoading, data: items } = useGetChecklistItems({
    checklistId,
  });
  const updateItem = useUpdateChecklistItem();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const incompleteItems = items?.filter((item) => !item.isCompleted) ?? [];
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

  if (isLoading) {
    return (
      <CardTitleDetailsChecklistContainer data-testid="CardTitleDetailsChecklistContainer">
        <ChecklistItemSkeleton />
      </CardTitleDetailsChecklistContainer>
    );
  }

  if (isItemsLoading) {
    return (
      <CardTitleDetailsChecklistContainer data-testid="CardTitleDetailsChecklistContainer">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckboxSkeleton data-testid="CheckboxSkeleton" />
            <ChecklistLabelSkeleton
              data-testid="ChecklistLabelSkeleton"
              style={{ width: '83%' }}
            />
          </div>
        ))}
      </CardTitleDetailsChecklistContainer>
    );
  }

  return (
    <CardTitleDetailsChecklistContainer data-testid="CardTitleDetailsChecklistContainer">
      {visibleItems.map((item) => (
        <CardTitleDetailsChecklistItemRow
          data-testid="CardTitleDetailsChecklistItemRow"
          key={item.id}
        >
          <CardTitleDetailsChecklistCheckbox
            checked={false}
            data-testid="CardTitleDetailsChecklistCheckbox"
            onClick={completeItem({ itemId: item.id, label: item.label })}
          >
            <CardTitleDetailsChecklistCheckboxIndicator data-testid="CardTitleDetailsChecklistCheckboxIndicator">
              <AiOutlineCheck size={12} />
            </CardTitleDetailsChecklistCheckboxIndicator>
          </CardTitleDetailsChecklistCheckbox>

          <CardTitleDetailsChecklistItemLabel data-testid="CardTitleDetailsChecklistItemLabel">
            {item.label}
          </CardTitleDetailsChecklistItemLabel>
        </CardTitleDetailsChecklistItemRow>
      ))}

      {hasMore && (
        <CardTitleDetailsChecklistShowMore
          data-testid="CardTitleDetailsChecklistShowMore"
          onClick={showMore}
          type="button"
        >
          Show more
        </CardTitleDetailsChecklistShowMore>
      )}
    </CardTitleDetailsChecklistContainer>
  );
}
