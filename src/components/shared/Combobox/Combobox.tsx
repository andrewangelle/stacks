import { useCombobox } from 'downshift';
import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import * as styles from '~/components/shared/Combobox/Combobox.css';

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
    <div className={styles.comboboxWrapper} data-testid="ComboboxWrapper">
      {/* biome-ignore lint/a11y/noLabelWithoutControl: <getLabelProps will associate with getInputProps> */}
      <label
        className={styles.comboboxLabel}
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
      </label>

      <div className={styles.comboboxTrigger} data-testid="ComboboxTrigger">
        <input
          className={styles.comboboxInput}
          {...getInputProps({
            autoFocus: false,
            placeholder: selectedItem?.label,
            'data-testid': 'ComboboxInput',
          })}
        />

        <button
          className={styles.comboboxIconButton}
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
        </button>
      </div>

      <ul
        className={styles.comboboxMenu}
        {...getMenuProps({
          'data-testid': `${testId}-ComboboxMenu`,
          style: {
            display: isOpen ? 'block' : 'none',
          },
        })}
      >
        {filteredItems.length > 0 &&
          filteredItems.map((item, index) => (
            <li
              className={styles.comboboxItem}
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
                <div
                  className={styles.comboboxItemCurrent}
                  data-testid="ComboboxItemCurrent"
                >
                  (current)
                </div>
              )}
            </li>
          ))}

        {filteredItems.length === 0 && (
          <li
            className={styles.comboboxItem}
            data-testid="ComboboxNoItems"
            style={{ textAlign: 'center' }}
          >
            No options
          </li>
        )}
      </ul>
    </div>
  );
}
