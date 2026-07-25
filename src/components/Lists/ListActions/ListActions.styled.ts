import { Popover } from 'radix-ui';
import * as styles from '~/components/Lists/ListActions/ListActions.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const ListActionsPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.listActionsPopoverTrigger,
);

export const ListActionsPopoverButton = styledEl(
  'div',
  styles.listActionsPopoverButton,
  ['isOpen'],
);

export const ListActionsPopoverButtonBack = styledEl(
  'button',
  styles.listActionsPopoverButtonBack,
  ['isActive'],
);

export const ListActionsPopoverButtonText = styledEl(
  'span',
  styles.listActionsPopoverButtonText,
);

export const ListActionsPopoverHeader = styledEl(
  'div',
  styles.listActionsPopoverHeader,
);

export const ListActionsPopoverClose = styledEl(
  Popover.Close,
  styles.listActionsPopoverClose,
);

export const ListActionsOptionsContainer = styledEl(
  'div',
  styles.listActionsOptionsContainer,
);

export const ListActionsOption = styledEl('button', styles.listActionsOption);

export const DeleteListButton = buttonEl(styles.deleteListButton);

export const MoveListFieldsContainer = styledEl(
  'div',
  styles.moveListFieldsContainer,
);

export const MoveListButton = buttonEl(styles.moveListButton);
