import * as styles from '~/components/Lists/List.css';
import { buttonEl } from '~/styles/Page.styled';
import { styledEl } from '~/styles/styledEl';

export const ListGridContainer = styledEl('div', styles.listGridContainer);

export const ListContainer = styledEl('div', styles.listContainer, [
  'isMobile',
]);

export const ListContentContainer = styledEl(
  'div',
  styles.listContentContainer,
);

export const ListHeaderContainer = styledEl('div', styles.listHeaderContainer);

export const AddCardFooter = styledEl('div', styles.addCardFooter);

export const ListName = styledEl('div', styles.listName);

export const EditListNameInput = styledEl('input', styles.editListNameInput);

export const AddListButton = styledEl('button', styles.addListButton);

export const AddCardButton = buttonEl(styles.addCardButton);

export const AddCardText = styledEl('button', styles.addCardText);

export const AddCardInput = styledEl('input', styles.addCardInput);

export const CloseAddCardButton = buttonEl(styles.closeAddCardButton);

export const ListCardContainer = styledEl('div', styles.listCardContainer);

export const ListCardSkeleton = styledEl('div', styles.listCardSkeleton);

export const ListHeaderSkeletonRow = styledEl(
  'div',
  styles.listHeaderSkeletonRow,
);

export const ListCardsSkeletonRow = styledEl(
  'div',
  styles.listCardsSkeletonRow,
);

export const ListNameSkeleton = styledEl('div', styles.listNameSkeleton);

export const ListCountSkeleton = styledEl('div', styles.listCountSkeleton);

export const AddListButtonSkeleton = styledEl(
  'div',
  styles.addListButtonSkeleton,
);

export const DottedLine = styledEl('div', styles.dottedLine);

export const AddNewCardAtPositionContainer = styledEl(
  'div',
  styles.addNewCardAtPositionContainer,
);

export const AddNewCardAtPositionPlus = styledEl(
  'div',
  styles.addNewCardAtPositionPlus,
);
