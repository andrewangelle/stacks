import * as styles from '~/components/Boards/Board.css';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const BoardListsFallback = styledEl('div', styles.boardListsFallback, [
  'background',
]);

type BackgroundProps = {
  background?: BoardBackground;
};

export const BoardHeaderFallback = styledEl<'div', BackgroundProps>(
  'div',
  styles.boardHeaderFallback,
  ['background'],
);

export const AddListContainer = styledEl('div', styles.addListContainer);

export const AddListInput = styledEl('input', styles.addListInput);

export const CreateListButton = buttonEl(styles.createListButton);

export const CloseAddListButton = buttonEl(styles.closeAddListButton);

export const BoardTitle = styledEl('div', styles.boardTitle);

export const BoardsLinkContainer = styledEl('div', styles.boardsLinkContainer);
