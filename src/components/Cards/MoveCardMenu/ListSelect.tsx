import type { RefObject } from 'react';
import { SelectSkeleton } from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import {
  ComboboxLabel,
  ComboboxWrapper,
} from '~/components/shared/Combobox/Combobox.styled';
import type { ListItem } from '~/db/lists/lists.query';

type ListSelectProps = {
  isListsLoading: boolean;
  lists?: ListItem[];
  currentListId?: string;
  selectedList?: string;
  setSelectedList: (listId: string) => void;
  ref: RefObject<HTMLDivElement | null>;
};

export function ListSelect({
  isListsLoading,
  lists,
  currentListId,
  selectedList,
  setSelectedList,
}: ListSelectProps) {
  const items =
    lists?.map((list) => ({
      id: list.id,
      label: list.listTitle,
      current: list.id === currentListId,
    })) ?? [];

  const selectedItem = items.find((item) => item.id === selectedList) ?? null;

  function onSelectedItemChange(item: ComboboxItemType | null) {
    if (item) {
      setSelectedList(item.id);
    }
  }

  if (isListsLoading) {
    return (
      <ComboboxWrapper>
        <ComboboxLabel>List</ComboboxLabel>
        <SelectSkeleton style={{ minHeight: '44px' }} />
      </ComboboxWrapper>
    );
  }

  return (
    <Combobox
      testId="List"
      label="List"
      items={items}
      selectedItem={selectedItem}
      onSelectedItemChange={onSelectedItemChange}
    />
  );
}
