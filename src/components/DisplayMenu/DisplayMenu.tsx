import { BoardIcon } from '~/components/DisplayMenu/BoardIcon';
import {
  DisplayMenuBoardButton,
  DisplayMenuBoardLabel,
  DisplayMenuContainer,
  DisplayMenuSeperator,
} from '~/components/DisplayMenu/DisplayMenu.styled';
import { SwitchBoards } from '~/components/DisplayMenu/SwitchBoards';

export function DisplayMenu() {
  return (
    <DisplayMenuContainer>
      <DisplayMenuBoardButton aria-current="page">
        <BoardIcon />
        <DisplayMenuBoardLabel>Board</DisplayMenuBoardLabel>
      </DisplayMenuBoardButton>
      <DisplayMenuSeperator />
      <SwitchBoards />
    </DisplayMenuContainer>
  );
}
