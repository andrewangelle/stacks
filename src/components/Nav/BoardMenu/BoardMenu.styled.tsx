import { Popover } from 'radix-ui';
import * as styles from '~/components/Nav/BoardMenu/BoardMenu.css';
import { styledEl } from '~/styles/styledEl';

export const BoardMenuPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.boardMenuPopoverTrigger,
);

export const BoardMenuPopoverButton = styledEl(
  'div',
  styles.boardMenuPopoverButton,
  ['isOpen'],
);

export const BoardMenuPopoverButtonBack = styledEl(
  'button',
  styles.boardMenuPopoverButtonBack,
  ['isActive'],
);

export const BoardMenuPopoverButtonText = styledEl(
  'span',
  styles.boardMenuPopoverButtonText,
);

export const BoardMenuPopoverHeader = styledEl(
  'div',
  styles.boardMenuPopoverHeader,
);

export const BoardMenuPopoverClose = styledEl(
  Popover.Close,
  styles.boardMenuPopoverClose,
);

export const BoardMenuOptionsContainer = styledEl(
  'div',
  styles.boardMenuOptionsContainer,
);

export const BoardMenuOption = styledEl('button', styles.boardMenuOption);

export const ChangeBoardBackgroundChoice = styledEl(
  'div',
  styles.changeBoardBackgroundChoice,
  ['background'],
);

export const BoardMenuTriggerLoaderSlot = styledEl(
  'span',
  styles.boardMenuTriggerLoaderSlot,
);
