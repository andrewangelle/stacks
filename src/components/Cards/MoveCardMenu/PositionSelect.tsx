import { type RefObject, useCallback, useMemo } from 'react';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import * as comboboxStyles from '~/components/shared/Combobox/Combobox.css';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

type PositionSelectProps = {
  isListsLoading: boolean;
  positions: number;
  selectedList: string;
  selectedPosition?: number;
  setSelectedPosition: (position: number) => void;
  ref: RefObject<HTMLDivElement | null>;
};

export function PositionSelect({
  selectedList,
  isListsLoading,
  positions,
  selectedPosition,
  setSelectedPosition,
}: PositionSelectProps) {
  const cardId = useCurrentCardId();
  const { data: currentCard } = useGetCardById({ id: cardId });
  const isSameList = currentCard?.listId === selectedList;

  const items = Array.from({ length: positions }, (_, index) => index + 1).map(
    (position) => ({
      id: position.toString(),
      label: position.toString(),
      current: isSameList && currentCard?.position === position - 1,
    }),
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
