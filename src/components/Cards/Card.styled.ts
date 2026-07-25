import { Dialog, Popover } from 'radix-ui';
import * as styles from '~/components/Cards/Card.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';
import {
  cardModalContentIndent,
  cardModalSectionIconSize,
} from '~/styles/tokens';

export { cardModalContentIndent, cardModalSectionIconSize };

export const CardModalRoot = Dialog.Root;
export const CardModalPortal = Dialog.Portal;

export const CardModalOverlay = styledEl(
  Dialog.Overlay,
  styles.cardModalOverlay,
);

export const CardModalBody = styledEl('div', styles.cardModalBody);

export const CardActionsContainer = styledEl(
  'div',
  styles.cardActionsContainer,
);

export const CardModalActionButton = styledEl(
  'div',
  styles.cardModalActionButton,
  ['isOpen'],
);

export const CardModalSiderButtonText = styledEl(
  'span',
  styles.cardModalSiderButtonText,
);

export const CreateChecklistPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.createChecklistPopoverTrigger,
);

export const DeleteCardPopoverTrigger = styledEl(
  Popover.Trigger,
  styles.deleteCardPopoverTrigger,
);

export const ResizeableCardColumnHandle = styledEl(
  'div',
  styles.resizeableCardColumnHandle,
);

export const CardMainColumn = styledEl('div', styles.cardMainColumn);

export const CardActivityColumn = styledEl('div', styles.cardActivityColumn);

export const CardPageActivityColumn = styledEl(
  'div',
  styles.cardPageActivityColumn,
);

export const CardModalContent = styledEl(
  Dialog.Content,
  styles.cardModalContent,
);

export const CardPageContent = styledEl(Dialog.Content, styles.cardPageContent);

export const CardModalTrigger = styledEl('div', styles.cardModalTrigger);

export const CardModalTitleContainer = styledEl(
  'div',
  styles.cardModalTitleContainer,
);

export const CardModalTitle = styledEl(Dialog.Title, styles.cardModalTitle);

export const CardModalHiddenTitle = styledEl(
  Dialog.Title,
  styles.cardModalHiddenTitle,
);

export const CardModalListName = styledEl('div', styles.cardModalListName);

export const DescriptionContainer = styledEl(
  'div',
  styles.descriptionContainer,
);

export const DescriptionHeadingRow = styledEl(
  'div',
  styles.descriptionHeadingRow,
);

export const DescriptionTitle = styledEl(Dialog.Title, styles.descriptionTitle);

export const DescriptionPlaceholder = styledEl(
  'div',
  styles.descriptionPlaceholder,
);

export const DescriptionInput = styledEl('textarea', styles.descriptionInput);

export const SaveDescriptionButton = buttonEl(styles.saveDescriptionButton);

export const CloseDescriptionButton = buttonEl(styles.closeDescriptionButton);

export const CardDescriptionText = styledEl('div', styles.cardDescriptionText);

export const EditDescriptionButton = buttonEl(styles.editDescriptionButton);

export const EditCardTitleForm = styledEl('form', styles.editCardTitleForm);

export const EditCardTitleInput = styledEl('input', styles.editCardTitleInput);
