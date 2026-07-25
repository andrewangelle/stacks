import { Dialog } from 'radix-ui';
import * as styles from '~/components/Cards/CardHeader/CardHeader.css';
import { styledEl } from '~/styles/styledEl';

export const CardHeaderContainer = styledEl('div', styles.cardHeaderContainer);

export const CardModalClose = styledEl(Dialog.Close, styles.cardModalClose);

export const CardPageClose = styledEl(Dialog.Close, styles.cardPageClose);

export const CardModalCloseSpinnerSlot = styledEl(
  'div',
  styles.cardModalCloseSpinnerSlot,
);
