import { Popover, Select } from 'radix-ui';
import * as styles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const SelectSkeleton = styledEl('div', styles.selectSkeleton);

export const MoveCardMenuTrigger = styledEl(
  Popover.Trigger,
  styles.moveCardMenuTrigger,
);

export const MoveCardMenuContent = styledEl(
  Popover.Content,
  styles.moveCardMenuContent,
);

export const MoveCardMenuHeader = styledEl('div', styles.moveCardMenuHeader);

export const DropdownLabel = styledEl('div', styles.dropdownLabel);

export const MoveCardButton = buttonEl(styles.moveCardButton);

export const SelectTrigger = styledEl(Select.Trigger, styles.selectTrigger);

export const SelectContent = styledEl(Select.Content, styles.selectContent);

export const SelectViewport = styledEl(Select.Viewport, styles.selectViewport);

export const SelectLabel = styledEl(Select.Label, styles.selectLabel);

export const SelectItem = styledEl(Select.Item, styles.selectItem);

export const SelectItemCurrent = styledEl('span', styles.selectItemCurrent);

export const MoveCardSelectRow = styledEl('div', styles.moveCardSelectRow);

export const MoveCardListColumn = styledEl('div', styles.moveCardListColumn);

export const MoveCardPositionColumn = styledEl(
  'div',
  styles.moveCardPositionColumn,
);

export const MoveCardFieldsContainer = styledEl(
  'div',
  styles.moveCardFieldsContainer,
);
