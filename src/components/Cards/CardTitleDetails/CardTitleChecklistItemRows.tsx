import type { MouseEvent } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  CardTitleChecklistCheckbox,
  CardTitleChecklistCheckboxIndicator,
  CardTitleChecklistItemLabel,
  CardTitleChecklistItemRow,
  CardTitleChecklistItemsList,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { useCreateActivity } from '~/query/activity';
import {
  useGetChecklistItems,
  useUpdateChecklistItem,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type CardTitleChecklistItemRowsProps = {
  checklistId: string;
};

export function CardTitleChecklistItemRows({
  checklistId,
}: CardTitleChecklistItemRowsProps) {
  const { data: checklist } = useGetChecklist({ checklistId });
  const { data: items } = useGetChecklistItems({ checklistId });
  const updateItem = useUpdateChecklistItem();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  const incompleteItems = items?.filter((item) => !item.isCompleted) ?? [];

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

  return (
    <CardTitleChecklistItemsList data-testid="CardTitleChecklistItemsList">
      {incompleteItems.map((item) => (
        <CardTitleChecklistItemRow
          data-testid="CardTitleChecklistItemRow"
          key={item.id}
        >
          <CardTitleChecklistCheckbox
            checked={false}
            data-testid="CardTitleChecklistCheckbox"
            onClick={completeItem({ itemId: item.id, label: item.label })}
          >
            <CardTitleChecklistCheckboxIndicator data-testid="CardTitleChecklistCheckboxIndicator">
              <AiOutlineCheck size={12} />
            </CardTitleChecklistCheckboxIndicator>
          </CardTitleChecklistCheckbox>

          <CardTitleChecklistItemLabel data-testid="CardTitleChecklistItemLabel">
            {item.label}
          </CardTitleChecklistItemLabel>
        </CardTitleChecklistItemRow>
      ))}
    </CardTitleChecklistItemsList>
  );
}
