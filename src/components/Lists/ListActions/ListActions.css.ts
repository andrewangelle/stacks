import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { popoverClose } from '~/components/Boards/Boards.css';
import { disabledButtonStyles, hoverOverlay } from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import { fontFamily, red } from '~/styles/tokens';

export const listActionsPopoverTrigger = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  width: 'auto',
  padding: 0,
});

export const listActionsPopoverButton = recipe({
  base: {
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    margin: 'auto',
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    padding: '0px 10px 8px',

    '::before': hoverOverlay,

    selectors: {
      '&:disabled': disabledButtonStyles,
    },
  },
  variants: {
    isOpen: {
      true: {
        color: 'white',
        background: 'rgba(0, 0, 0, 0.8)',
        ':hover': {
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
        },
      },
      false: {
        color: 'rgba(9, 30, 66, 0.9)',
        background: 'transparent',
        ':hover': {
          background: 'rgba(9, 30, 66, 0.2)',
          color: 'rgba(9, 30, 66, 0.9)',
        },
      },
    },
  },
});

export const listActionsPopoverButtonBack = recipe({
  base: {
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    margin: 'auto',
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    color: 'rgba(9, 30, 66, 0.9)',
    background: 'transparent',

    '::before': hoverOverlay,

    ':hover': {
      color: 'rgba(9, 30, 66, 0.9)',
    },

    selectors: {
      '&:disabled': disabledButtonStyles,
    },
  },
  variants: {
    isActive: {
      true: {
        cursor: 'pointer',
        ':hover': { background: 'rgba(9, 30, 66, 0.2)' },
      },
      false: {
        cursor: 'default',
        ':hover': { background: 'transparent' },
      },
    },
  },
});

export const listActionsPopoverButtonText = style({
  fontFamily,
  fontSize: '14px',
});

export const listActionsPopoverHeader = style({
  fontWeight: 600,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'rgba(9, 30, 66, .75)',
  padding: '5px 0px 10px 5px',
});

export const listActionsPopoverClose = style([
  popoverClose,
  {
    fontWeight: 600,
    margin: '4px',
    position: 'relative',

    ':hover': {
      background: 'rgba(9, 30, 66, 0.2)',
      borderRadius: '4px',
    },
  },
]);

export const listActionsOptionsContainer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const listActionsOption = style({
  padding: '8px 10px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  width: '100%',
  fontSize: '14px',

  ':hover': {
    background: 'rgba(0,0,0,0.05)',
  },

  ':active': {
    background: 'rgba(0,0,0,0.1)',
  },
});

export const deleteListButton = style([
  button,
  {
    background: red,
    width: '100%',
    margin: '15px 0px 0px',
    padding: '8px 10px',
  },
]);

export const moveListFieldsContainer = style({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '8px',
});

export const moveListButton = style([
  button,
  {
    width: 'calc(100% - 20px)',
    margin: '8px 10px 0px',
    padding: '10px 20px',
    fontWeight: 500,
  },
]);
