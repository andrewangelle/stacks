import { useCombobox } from 'downshift';
import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  ComboboxIconButton,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemCurrent,
  ComboboxLabel,
  ComboboxMenu,
  ComboboxTrigger,
  ComboboxWrapper,
} from '~/components/Combobox/Combobox.styled';

export type ComboboxItemType = {
  id: string;
  label: string;
  current?: boolean;
};

export type ComboboxProps = {
  testId?: string;
  label?: string;
  items: ComboboxItemType[];
  selectedItem: ComboboxItemType | null;
  onSelectedItemChange: (item: ComboboxItemType | null) => void;
  debug?: boolean;
};

export function Combobox({
  testId,
  debug = false,
  label = 'Choose an element:',
  items = [],
  selectedItem,
  onSelectedItemChange,
}: ComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (query.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const startsWith = item.label
        .trim()
        .toLowerCase()
        .startsWith(query.trim().toLowerCase());

      if (startsWith) {
        if (debug) {
          console.log({
            label: item.label,
            query,
            startsWith,
          });
        }
        return true;
      }

      const contains = item.label
        .trim()
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      if (debug) {
        console.log({
          label: item.label,
          query,
          startsWith,
          contains,
        });
      }

      return contains;
    });
  }, [items, query, debug]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: filteredItems,
    selectedItem,
    inputValue: query,
    itemToString(item) {
      return item?.label ?? '';
    },
    stateReducer(_state, { type, changes }) {
      if (debug) {
        console.log('stateReducer', { type, changes });
      }

      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputKeyDownEscape:
        case useCombobox.stateChangeTypes.InputBlur:
        case useCombobox.stateChangeTypes.ToggleButtonClick:
        case useCombobox.stateChangeTypes.InputClick:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
          return { ...changes, inputValue: '' };
        }
        default:
          return changes;
      }
    },
    onInputValueChange({ inputValue }) {
      setQuery(inputValue ?? '');
    },
    onSelectedItemChange({ selectedItem: nextSelectedItem }) {
      setQuery('');
      onSelectedItemChange(nextSelectedItem ?? null);
    },
  });

  return (
    <ComboboxWrapper data-testid="ComboboxWrapper">
      <ComboboxLabel
        {...getLabelProps({
          'data-testid': 'ComboboxLabel',
          onClick(event: MouseEvent<HTMLLabelElement>) {
            // Prevent the trigger events from being invoked by label interaction
            event.preventDefault();
            event.stopPropagation();
          },
        })}
      >
        {label}
      </ComboboxLabel>

      <ComboboxTrigger data-testid="ComboboxTrigger">
        <ComboboxInput
          {...getInputProps({
            autoFocus: false,
            placeholder: selectedItem?.label,
            'data-testid': 'ComboboxInput',
          })}
        />

        <ComboboxIconButton
          {...getToggleButtonProps({
            'aria-label': 'toggle menu',
            'data-testid': `${testId}-ComboboxToggleButton`,
          })}
        >
          <RxCaretDown
            data-testid="ComboboxCaretDown"
            size={20}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </ComboboxIconButton>
      </ComboboxTrigger>

      <ComboboxMenu
        {...getMenuProps({
          'data-testid': `${testId}-ComboboxMenu`,
          style: {
            display: isOpen ? 'block' : 'none',
          },
        })}
      >
        {filteredItems.length > 0 &&
          filteredItems.map((item, index) => (
            <ComboboxItem
              key={item.id}
              {...getItemProps({
                'data-testid': `ComboboxItem-${item.label}`,
                'data-highlighted': highlightedIndex === index,
                'data-selected': selectedItem?.id === item.id,
                item,
                index,
              })}
            >
              {item.label}

              {item.current && (
                <ComboboxItemCurrent data-testid="ComboboxItemCurrent">
                  (current)
                </ComboboxItemCurrent>
              )}
            </ComboboxItem>
          ))}

        {filteredItems.length === 0 && (
          <ComboboxItem
            data-testid="ComboboxNoItems"
            style={{ textAlign: 'center' }}
          >
            No options
          </ComboboxItem>
        )}
      </ComboboxMenu>
    </ComboboxWrapper>
  );
}
