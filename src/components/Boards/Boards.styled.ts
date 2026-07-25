import { Link } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import { TiDelete } from 'react-icons/ti';
import * as styles from '~/components/Boards/Boards.css';
import { styledEl } from '~/styles/styledEl';
import {
  type BoardBackground,
  blue,
  darkGray,
  fontFamily,
  green,
  lightGreen,
  orange,
  red,
} from '~/styles/tokens';

export type { BoardBackground };
export { blue, darkGray, fontFamily, green, lightGreen, orange, red };

export type BackgroundProps = {
  background?: BoardBackground;
};

export const BoardsContainer = styledEl('div', styles.boardsContainer);

export const BoardCardLink = styledEl(Link, styles.boardCardLink, [
  'background',
]);

export const CreateBoardContainer = styledEl(
  'div',
  styles.createBoardContainer,
  ['background'],
);

export type BoardCardTitleProps = {
  isCreateBoard?: boolean;
};

export const BoardCardTitle = styledEl<'div', BoardCardTitleProps>(
  'div',
  styles.boardCardTitle,
  ['isCreateBoard'],
);

export const BoardCardSkeleton = styledEl('div', styles.boardCardSkeleton);

export const CreateBoardCard = styledEl('div', styles.createBoardCard);

export const CreateBoardPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.createBoardPopoverTrigger,
);

export const PopoverClose = styledEl(Popover.Close, styles.popoverClose);

export const CreateBoardPopoverContent = styledEl(
  Popover.Content,
  styles.createBoardPopoverContent,
);

export const CreateBoardPopoverHeader = styledEl(
  'div',
  styles.createBoardPopoverHeader,
);

export const CreateBoardCloseBorder = styledEl(
  'hr',
  styles.createBoardCloseBorder,
);

export const CreateBoardBackgroundText = styledEl(
  'div',
  styles.createBoardBackgroundText,
);

export const CreateBoardBackgroundChoices = styledEl(
  'div',
  styles.createBoardBackgroundChoices,
);

export const CreateBoardBackgroundChoice = styledEl(
  'div',
  styles.createBoardBackgroundChoice,
  ['background'],
);

export const CreateBoardTitleInput = styledEl(
  'input',
  styles.createBoardTitleInput,
);

export const CreateBoardButton = styledEl('button', styles.createBoardButton);

export const DeleteBoardIcon = styledEl(TiDelete, styles.deleteBoardIcon);
