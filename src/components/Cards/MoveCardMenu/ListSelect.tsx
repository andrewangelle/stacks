import { type RefObject, useCallback, useMemo } from 'react';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import * as comboboxStyles from '~/components/shared/Combobox/Combobox.css';
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
      <div
        className={comboboxStyles.comboboxWrapper}
        data-testid="ComboboxWrapper"
      >
        <span
          className={comboboxStyles.comboboxLabel}
          data-testid="ComboboxLabel"
        >
          List
        </span>
        <div
          className={moveCardMenuStyles.selectSkeleton}
          style={{ minHeight: '44px' }}
        />
      </div>
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
