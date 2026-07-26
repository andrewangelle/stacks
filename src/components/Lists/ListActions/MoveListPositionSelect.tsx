import { useCallback, useMemo } from 'react';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import * as comboboxStyles from '~/components/shared/Combobox/Combobox.css';

type MoveListPositionSelectProps = {
  isListsLoading: boolean;
  positions: number;
  isSameBoard: boolean;
  currentPosition?: number;
  selectedPosition?: number;
  setSelectedPosition: (position: number) => void;
};

export function MoveListPositionSelect({
  isListsLoading,
  positions,
  isSameBoard,
  currentPosition,
  selectedPosition,
  setSelectedPosition,
}: MoveListPositionSelectProps) {
  const items = useMemo(
    () =>
      Array.from({ length: positions }, (_, index) => index + 1).map(
        (position) => ({
          id: position.toString(),
          label: position.toString(),
          current: isSameBoard && currentPosition === position - 1,
        }),
      ),
    [positions, isSameBoard, currentPosition],
  );

  const selectedItem = useMemo(
    () =>
      items.find((item) => item.id === selectedPosition?.toString()) ?? null,
    [items, selectedPosition],
  );

  const onSelectedItemChange = useCallback(
    (item: ComboboxItemType | null) => {
      if (item) {
        setSelectedPosition(Number(item.id));
      }
    },
    [setSelectedPosition],
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
          Position
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
      testId="Position"
      label="Position"
      items={items}
      selectedItem={selectedItem}
      onSelectedItemChange={onSelectedItemChange}
    />
  );
}
