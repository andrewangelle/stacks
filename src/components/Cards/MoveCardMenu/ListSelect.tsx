import * as Select from '@radix-ui/react-select';
import type { RefObject } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  SelectContent,
  SelectItem,
  SelectItemCurrent,
  SelectSkeleton,
  SelectTrigger,
  SelectViewport,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
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
  ref,
}: ListSelectProps) {
  if (isListsLoading) {
    return <SelectSkeleton style={{ minHeight: '44px' }} />;
  }

  return (
    <Select.Root value={selectedList ?? ''} onValueChange={setSelectedList}>
      <SelectTrigger aria-label="List" data-testid="ListSelectTrigger">
        <Select.Value placeholder="Select a list" />

        <Select.Icon data-testid="SelectIcon">
          <RxCaretDown size={20} data-testid="RxCaretDown" />
        </Select.Icon>
      </SelectTrigger>

      <Select.Portal container={ref.current}>
        <SelectContent
          position="popper"
          sideOffset={4}
          data-testid="ListSelectContent"
        >
          <Select.ScrollUpButton data-testid="SelectScrollUpButton">
            <RxCaretDown size={20} data-testid="RxCaretDown" />
          </Select.ScrollUpButton>

          <SelectViewport>
            <Select.Group>
              {lists?.map((list) => (
                <SelectItem
                  key={list.id}
                  value={list.id}
                  data-testid={`ListSelectItem-${list.listTitle}`}
                >
                  <Select.ItemText>{list.listTitle}</Select.ItemText>

                  {list.id === currentListId && (
                    <SelectItemCurrent data-testid="ListSelectCurrent">
                      (current)
                    </SelectItemCurrent>
                  )}
                </SelectItem>
              ))}
            </Select.Group>
          </SelectViewport>

          <Select.ScrollDownButton data-testid="SelectScrollDownButton">
            <RxCaretDown size={20} data-testid="RxCaretDown" />
          </Select.ScrollDownButton>
        </SelectContent>
      </Select.Portal>
    </Select.Root>
  );
}
