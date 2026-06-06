import type { MouseEvent } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  CardTitleChecklistCheckbox,
  CardTitleChecklistCheckboxIndicator,
  CardTitleChecklistItemLabel,
  CardTitleChecklistItemRow,
  CardTitleChecklistItemsList,
} from '~/components/Cards/Card.styled';
import {
  useGetChecklistItems,
  useUpdateChecklistItem,
} from '~/query/checklistItems';

type CardTitleChecklistItemRowsProps = {
  checklistId: string;
};

export function CardTitleChecklistItemRows({
  checklistId,
}: CardTitleChecklistItemRowsProps) {
  const { data: items } = useGetChecklistItems({ checklistId });
  const updateItem = useUpdateChecklistItem();

  const incompleteItems = items?.filter((item) => !item.isCompleted) ?? [];

  function completeItem(
    event: MouseEvent<HTMLButtonElement>,
    itemId: string,
    label: string,
  ) {
    event.preventDefault();
    event.stopPropagation();

    updateItem({
      itemId,
      label,
      isCompleted: true,
    });
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
            onClick={(event) => completeItem(event, item.id, item.label)}
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
