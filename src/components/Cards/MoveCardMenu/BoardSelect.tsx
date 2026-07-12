import * as Select from '@radix-ui/react-select';
import type { RefObject } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  SelectContent,
  SelectItem,
  SelectItemCurrent,
  SelectTrigger,
  SelectViewport,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { useGetBoards } from '~/db/boards/boards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type BoardSelectProps = {
  cardId: string;
  selectedBoardId?: string;
  setSelectedBoardId: (boardId: string) => void;
  ref: RefObject<HTMLDivElement | null>;
};

export function BoardSelect({
  ref,
  selectedBoardId,
  setSelectedBoardId,
}: BoardSelectProps) {
  const boardId = useCurrentBoardId();
  const { data: boards } = useGetBoards();
  return (
    <Select.Root value={selectedBoardId} onValueChange={setSelectedBoardId}>
      <SelectTrigger aria-label="Board" data-testid="BoardSelectTrigger">
        <Select.Value placeholder="Select a board" />

        <Select.Icon data-testid="SelectIcon">
          <RxCaretDown size={20} data-testid="RxCaretDown" />
        </Select.Icon>
      </SelectTrigger>

      <Select.Portal container={ref.current}>
        <SelectContent
          position="popper"
          sideOffset={4}
          data-testid="BoardSelectContent"
        >
          <Select.ScrollUpButton data-testid="SelectScrollUpButton">
            <RxCaretDown size={20} data-testid="RxCaretDown" />
          </Select.ScrollUpButton>

          <SelectViewport>
            <Select.Group>
              {boards?.map((board) => (
                <SelectItem
                  key={board.id}
                  value={board.id}
                  data-testid={`BoardSelectItem-${board.boardTitle}`}
                >
                  <Select.ItemText>{board.boardTitle}</Select.ItemText>

                  {board.id === boardId && (
                    <SelectItemCurrent data-testid="BoardSelectCurrent">
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
