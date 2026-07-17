import { type RefObject, useCallback, useMemo } from 'react';
import { SelectSkeleton } from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/Combobox/Combobox';
import {
  ComboboxLabel,
  ComboboxWrapper,
} from '~/components/Combobox/Combobox.styled';
import type { ListItem } from '~/db/lists/lists.cache';

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
  const items = useMemo(
    () =>
      lists?.map((list) => ({
        id: list.id,
        label: list.listTitle,
        current: list.id === currentListId,
      })) ?? [],
    [lists, currentListId],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedList) ?? null,
    [items, selectedList],
  );

  const onSelectedItemChange = useCallback(
    (item: ComboboxItemType | null) => {
      if (item) {
        setSelectedList(item.id);
      }
    },
    [setSelectedList],
  );

  if (isListsLoading) {
    return (
      <ComboboxWrapper data-testid="ComboboxWrapper">
        <ComboboxLabel data-testid="ComboboxLabel">List</ComboboxLabel>
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
