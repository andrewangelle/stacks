import * as styles from '~/components/Nav/Nav.css';
import { styledEl } from '~/styles/styledEl';

export const NavBarContainer = styledEl('div', styles.navBarContainer);

export const NavBarContent = styledEl('div', styles.navBarContent, [
  'background',
]);

export const NavColumn = styledEl('div', styles.navColumn);

export const BoardHeaderContainer = styledEl(
  'div',
  styles.boardHeaderContainer,
  ['background'],
);

export const BoardPageBackground = styledEl('div', styles.boardPageBackground, [
  'background',
]);

export const BoardTitle = styledEl('button', styles.boardTitle);

export const EditBoardTitleForm = styledEl('form', styles.editBoardTitleForm);

export const EditBoardTitleInput = styledEl(
  'input',
  styles.editBoardTitleInput,
);
