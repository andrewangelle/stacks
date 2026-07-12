import * as Select from '@radix-ui/react-select';
import type { RefObject } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectViewport,
} from '~/components/Cards/CardHeader/CardHeader.styled';

type PositionSelectProps = {
  positions: number;
  selectedPosition?: number;
  setSelectedPosition: (position: number) => void;
  ref: RefObject<HTMLDivElement | null>;
};

export function PositionSelect({
  positions,
  selectedPosition,
  setSelectedPosition,
  ref,
}: PositionSelectProps) {
  return (
    <Select.Root
      value={selectedPosition ? String(selectedPosition) : ''}
      onValueChange={(value) => setSelectedPosition(Number(value))}
    >
      <SelectTrigger aria-label="Position" data-testid="PositionSelectTrigger">
        <Select.Value placeholder="1" />

        <Select.Icon data-testid="SelectIcon">
          <RxCaretDown size={20} data-testid="RxCaretDown" />
        </Select.Icon>
      </SelectTrigger>

      <Select.Portal container={ref.current}>
        <SelectContent
          position="popper"
          sideOffset={4}
          data-testid="PositionSelectContent"
        >
          <Select.ScrollUpButton data-testid="SelectScrollUpButton">
            <RxCaretDown size={20} data-testid="RxCaretDown" />
          </Select.ScrollUpButton>

          <SelectViewport>
            <Select.Group>
              {Array.from({ length: positions }, (_, index) => index + 1).map(
                (position) => (
                  <SelectItem
                    key={position}
                    value={String(position)}
                    data-testid={`PositionSelectItem-${position}`}
                  >
                    <Select.ItemText>{position}</Select.ItemText>
                  </SelectItem>
                ),
              )}
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
