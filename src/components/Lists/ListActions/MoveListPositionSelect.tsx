import { SelectSkeleton } from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import {
  ComboboxLabel,
  ComboboxWrapper,
} from '~/components/shared/Combobox/Combobox.styled';

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
  const items = Array.from({ length: positions }, (_, index) => index + 1).map(
    (position) => ({
      id: position.toString(),
      label: position.toString(),
      current: isSameBoard && currentPosition === position - 1,
    }),
  );

  const selectedItem =
    items.find((item) => item.id === selectedPosition?.toString()) ?? null;

  function onSelectedItemChange(item: ComboboxItemType | null) {
    if (item) {
      setSelectedPosition(Number(item.id));
    }
  }

  if (isListsLoading) {
    return (
      <ComboboxWrapper>
        <ComboboxLabel>Position</ComboboxLabel>
        <SelectSkeleton style={{ minHeight: '44px' }} />
      </ComboboxWrapper>
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
