import { BoardIcon } from '~/components/DisplayMenu/BoardIcon';
import {
  DisplayMenuBoardButton,
  DisplayMenuBoardLabel,
  DisplayMenuContainer,
  DisplayMenuSeperator,
} from '~/components/DisplayMenu/DisplayMenu.styled';
import { SwitchBoards } from '~/components/DisplayMenu/SwitchBoards';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useIsMobile } from '~/utils/useIsMobile';

export function DisplayMenu() {
  const isMobile = useIsMobile();
  return (
    <DisplayMenuContainer $isMobile={isMobile}>
      <Tooltip content="Board">
        <DisplayMenuBoardButton aria-current="page">
          <BoardIcon />
          <DisplayMenuBoardLabel>Board</DisplayMenuBoardLabel>
        </DisplayMenuBoardButton>
      </Tooltip>

      <DisplayMenuSeperator />

      <SwitchBoards />
    </DisplayMenuContainer>
  );
}
