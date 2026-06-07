import type { MouseEvent } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  CardTitleDetailsChecklistCheckbox,
  CardTitleDetailsChecklistCheckboxIndicator,
  CardTitleDetailsChecklistContainer,
  CardTitleDetailsChecklistItemLabel,
  CardTitleDetailsChecklistItemRow,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { useCreateActivity } from '~/query/activity';
import {
  useGetChecklistItems,
  useUpdateChecklistItem,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type CardTitleDetailsChecklistProps = {
  checklistId: string;
};

export function CardTitleDetailsChecklist({
  checklistId,
}: CardTitleDetailsChecklistProps) {
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
    <CardTitleDetailsChecklistContainer data-testid="CardTitleDetailsChecklistContainer">
      {incompleteItems.map((item) => (
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
    </CardTitleDetailsChecklistContainer>
  );
}
