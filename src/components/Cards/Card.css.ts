import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import {
  disabledButtonStyles,
  hoverOverlay,
  secondaryButtonStyles,
} from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import {
  cardModalBreakpointQuery,
  cardModalContentIndent,
  focusRingBlue,
  fontFamily,
} from '~/styles/tokens';

export const cardModalOverlay = style({
  background: 'rgba(0 0 0 / 0.8)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'grid',
  placeItems: 'center',
  overflowY: 'auto',
  zIndex: 2,
});

export const cardModalBody = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 8px minmax(200px, 280px)',
  gridTemplateRows: 'minmax(0, 1fr)',
  gap: 0,
  alignItems: 'stretch',
  flex: '1 1 auto',
  minHeight: 0,
  overflow: 'hidden',

  '@media': {
    [cardModalBreakpointQuery]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  },
});

export const cardActionsContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  margin: '12px 12px 0px 44px',
});

export const cardModalActionButton = recipe({
  base: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    margin: 'auto',
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    border: '1px solid rgba(9, 30, 66, 0.2)',
    cursor: 'pointer',
    fontWeight: 600,
    padding: '8px 10px',

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
          background: 'rgba(9, 30, 66, 0.04)',
          color: 'rgba(9, 30, 66, 0.9)',
        },
      },
    },
  },
});

export const cardModalSiderButtonText = style({
  fontFamily,
  fontSize: '14px',
});

export const createChecklistPopoverTrigger = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  width: 'auto',
});

export const deleteCardPopoverTrigger = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  width: 'auto',
});

export const resizeableCardColumnHandle = style({
  height: '100%',
  cursor: 'ew-resize',
  touchAction: 'none',
  position: 'relative',
  userSelect: 'none',

  '::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '100%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.2)',
    width: '1px',
  },

  selectors: {
    '&:hover::after': {
      background: focusRingBlue,
      width: '2px',
    },
  },

  '@media': {
    [cardModalBreakpointQuery]: {
      display: 'none',
    },
  },
});

export const cardMainColumn = style({
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',

  '@media': {
    [cardModalBreakpointQuery]: {
      paddingRight: 0,
      flexShrink: 0,
      minHeight: 'unset',
      overflow: 'visible',
    },
  },
});

export const cardActivityColumn = style({
  minWidth: 0,
  minHeight: 0,
  background: 'rgb(248, 248, 248)',
  overflowY: 'auto',
  padding: 0,

  '@media': {
    [cardModalBreakpointQuery]: {
      background: 'white',
      flexShrink: 0,
      minHeight: 'unset',
      overflow: 'visible',
    },
  },
});

export const cardPageActivityColumn = style([
  cardActivityColumn,
  {
    background: 'transparent',

    '@media': {
      [cardModalBreakpointQuery]: {
        background: 'transparent',
      },
    },
  },
]);

export const cardModalContent = style({
  position: 'relative',
  fontFamily,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '88vw',
  height: '95vh',
  width: '100%',
  margin: '0 30px',
  overflow: 'hidden',
  background: 'white',
  borderRadius: '8px',

  '@media': {
    [cardModalBreakpointQuery]: {
      minWidth: 'unset',
      maxWidth: 'calc(100% - 30px)',
      height: 'auto',
      maxHeight: '99vh',
    },
  },
});

export const cardPageContent = style({
  position: 'relative',
  fontFamily,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  paddingTop: '116px',
  background: 'rgb(248, 248, 248)',
});

export const cardModalTrigger = style({
  border: 'none',
  padding: '0px',
  cursor: 'pointer',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  borderRadius: '5px',
  textAlign: 'left',

  ':focus': {
    outline: `2px solid ${focusRingBlue}`,
    outlineOffset: '-2px',
  },
});

export const cardModalTitleContainer = style({
  display: 'flex',
  margin: '12px 12px 0px',
});

export const cardModalTitle = style({
  margin: '0 16px',
  fontSize: '28px',
  color: 'black',

  selectors: {
    '&[data-completed]': {
      color: 'rgba(0,0,0, 0.5)',
    },
  },
});

export const cardModalHiddenTitle = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

export const cardModalListName = style({
  fontSize: '14px',
  margin: '4px 12px 12px 20px',
});

export const descriptionContainer = style({
  margin: '30px 12px 0px',
});

export const descriptionHeadingRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
});

export const descriptionTitle = style([
  cardModalTitle,
  {
    fontSize: '14px',
  },
]);

export const descriptionPlaceholder = style({
  border: '1px solid rgba(0,0,0, 0.5)',
  height: '30px',
  marginLeft: cardModalContentIndent,
  fontSize: '14px',
  padding: '15px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: 'rgba(0,0,0, 0.5)',
  fontWeight: 500,

  ':hover': {
    background: 'rgba(0,0,0, 0.1)',
  },
});

export const descriptionInput = style({
  height: '60px',
  width: '80%',
  marginLeft: cardModalContentIndent,
  marginBottom: '12px',
  fontSize: '14px',
  padding: '15px',
  borderRadius: '8px',
  border: 'none',
  fontFamily,
});

export const saveDescriptionButton = style([
  button,
  {
    padding: '8px 10px',
    margin: `0 10px 0 ${cardModalContentIndent}`,
  },
]);

export const closeDescriptionButton = style([
  button,
  {
    ...secondaryButtonStyles,
    padding: '8px 10px',
    margin: 0,
    color: 'black',
    border: 'none',

    selectors: {
      '&:hover:not(:disabled)': {
        color: secondaryButtonStyles.color,
      },
    },
  },
]);

export const cardDescriptionText = style({
  fontFamily,
  marginLeft: cardModalContentIndent,
  fontSize: '14px',
  marginTop: '15px',
});

export const editDescriptionButton = style([
  button,
  {
    ...secondaryButtonStyles,
    color: 'rgba(9, 30, 66, 0.725)',
    border: '1px solid rgba(9, 30, 66, 0.2)',
    padding: '8px 10px',
    margin: 0,
    fontSize: '14px',
    flexShrink: 0,

    selectors: {
      '&:hover:not(:disabled)': {
        color: secondaryButtonStyles.color,
      },
    },
  },
]);

export const editCardTitleForm = style({
  position: 'relative',
  top: '-1px',
  left: '-2px',
});

export const editCardTitleInput = style({
  border: 'none',
  margin: '0 16px',
  fontSize: '28px',
  fontWeight: 700,
  fontFamily,
});
