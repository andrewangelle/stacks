import { Checkbox, Popover } from 'radix-ui';
import { AiOutlineEllipsis } from 'react-icons/ai';
import * as styles from '~/components/ChecklistItem/ChecklistItem.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const AddChecklistItemButton = buttonEl(styles.addChecklistItemButton);

export const AddChecklistItemInput = styledEl(
  'textarea',
  styles.addChecklistItemInput,
);

export const AddChecklistItemInputIndented = styledEl(
  'textarea',
  styles.addChecklistItemInputIndented,
);

export const ChecklistItemActions = styledEl(
  'div',
  styles.checklistItemActions,
);

export const ChecklistItemActionsIndented = styledEl(
  'div',
  styles.checklistItemActionsIndented,
);

export const CheckboxIndicator = styledEl(
  Checkbox.Indicator,
  styles.checkboxIndicator,
);

export const CheckboxLabel = styledEl('label', styles.checkboxLabel, [
  'checked',
]);

export const EditChecklistItemContainer = styledEl(
  'div',
  styles.editChecklistItemContainer,
);

export const AddChecklistButton = buttonEl(styles.addChecklistButton);

export const DeleteChecklistPopoverButton = buttonEl(
  styles.deleteChecklistPopoverButton,
);

export const ChecklistLeadingColumn = styledEl(
  'div',
  styles.checklistLeadingColumn,
);

export const ChecklistContentColumn = styledEl(
  'div',
  styles.checklistContentColumn,
);

export const ChecklistCheckboxContentColumn = styledEl(
  'div',
  styles.checklistCheckboxContentColumn,
  ['isHovering'],
);

export const ChecklistCheckboxContainer = styledEl(
  'div',
  styles.checklistCheckboxContainer,
);

export const CheckboxRoot = styledEl(Checkbox.Root, styles.checkboxRoot);

export const ChecklistItemOptionsPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.checklistItemOptionsPopoverTrigger,
);

export const DeleteChecklistPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.deleteChecklistPopoverTrigger,
);

export const ChecklistItemOptionsEllipsis = styledEl(
  AiOutlineEllipsis,
  styles.checklistItemOptionsEllipsis,
);

export const ChecklistItemSkeletonContainer = styledEl(
  'div',
  styles.checklistItemSkeletonContainer,
);

export const CheckboxSkeleton = styledEl('div', styles.checkboxSkeleton);

export const ChecklistLabelSkeleton = styledEl(
  'div',
  styles.checklistLabelSkeleton,
);

export const AddChecklistButtonSkeleton = styledEl(
  'div',
  styles.addChecklistButtonSkeleton,
);

export const ChecklistItemOptionsListContainer = styledEl(
  'div',
  styles.checklistItemOptionsListContainer,
);

export const ChecklistItemOptionsListItem = styledEl(
  'button',
  styles.checklistItemOptionsListItem,
);
