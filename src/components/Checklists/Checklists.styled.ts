import { Dialog, Popover, Progress } from 'radix-ui';
import { cardModalActionButton } from '~/components/Cards/Card.css';
import { EditCardTitleForm } from '~/components/Cards/Card.styled';
import * as styles from '~/components/Checklists/Checklists.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const ChecklistsContainer = styledEl('div', styles.checklistsContainer);

export const ChecklistContainer = styledEl('div', styles.checklistContainer);

export const ChecklistPopoverContent = styledEl(
  Popover.Content,
  styles.checklistPopoverContent,
);

export const ChecklistItemOptionsContent = styledEl(
  Popover.Content,
  styles.checklistItemOptionsContent,
);

export const ChecklistPopoverHeader = styledEl(
  'div',
  styles.checklistPopoverHeader,
);

export const CreateChecklistTitle = styledEl(
  'div',
  styles.createChecklistTitle,
);

export const CreateChecklistInput = styledEl(
  'input',
  styles.createChecklistInput,
);

export const CreateChecklistAddButton = buttonEl(
  styles.createChecklistAddButton,
);

function deleteChecklistButton(variants?: { isOpen?: boolean }) {
  return `${cardModalActionButton(variants)} ${styles.deleteChecklistButtonSize}`;
}

export const DeleteChecklistButton = styledEl('div', deleteChecklistButton, [
  'isOpen',
]);

export const ChecklistHeaderActions = styledEl(
  'div',
  styles.checklistHeaderActions,
);

export const ToggleCheckedItemsButton = buttonEl(
  styles.toggleCheckedItemsButton,
);

export const AllItemsCompleteMessage = styledEl(
  'p',
  styles.allItemsCompleteMessage,
);

export const ChecklistHeader = styledEl('div', styles.checklistHeader);

export const ChecklistProgressIndicator = styledEl(
  Progress.Indicator,
  styles.checklistProgressIndicator,
);

export const ChecklistProgressRoot = styledEl(
  Progress.Root,
  styles.checklistProgressRoot,
);

export const ChecklistProgressRow = styledEl(
  'div',
  styles.checklistProgressRow,
);

export const ChecklistProgressPercentage = styledEl(
  'span',
  styles.checklistProgressPercentage,
);

export const ChecklistTitle = styledEl(Dialog.Title, styles.checklistTitle);

export const EditChecklistTitleForm = EditCardTitleForm;

export const EditChecklistTitleInput = styledEl(
  'input',
  styles.editChecklistTitleInput,
);

export const ChecklistNameSkeletonContainer = styledEl(
  'div',
  styles.checklistNameSkeletonContainer,
);

export const ChecklistNameSkeleton = styledEl(
  'div',
  styles.checklistNameSkeleton,
);

export const DeleteChecklistSkeleton = styledEl(
  'div',
  styles.deleteChecklistSkeleton,
);

export const ChecklistProgressSkeleton = styledEl(
  'div',
  styles.checklistProgressSkeleton,
);
