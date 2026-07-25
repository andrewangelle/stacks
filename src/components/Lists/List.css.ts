import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animationStyles } from '~/styles/animations';
import { activityFieldStyles } from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import { focusRingBlue, fontFamily, listBackground } from '~/styles/tokens';

export const listGridContainer = style({
  display: 'grid',
  gridTemplateRows: '100% 1fr max-content',
  gridTemplateColumns: '100px 1fr max-content',
});

export const listContainer = recipe({
  base: {
    backgroundColor: listBackground,
    borderRadius: '8px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: 'max-content',
    position: 'relative',
    whiteSpace: 'normal',
    width: '275px',
    padding: '0px 8px',
    margin: '0 15px',
    overflow: 'auto',
  },
  variants: {
    isMobile: {
      true: { maxHeight: '80%' },
      false: { maxHeight: '100%' },
    },
  },
});

export const listContentContainer = style({
  overscrollBehavior: 'contain',
  width: '100%',
  minWidth: 0,
});

/**
 * Cards scroll underneath the header and the add-card footer, so those two
 * carry the list's vertical padding themselves — listContainer only pads the
 * sides, or the gap would show cards passing through it.
 */
export const listHeaderContainer = style({
  position: 'sticky',
  top: 0,
  // Stays under navBarContainer's z-index 2: nothing here creates a stacking
  // context, so these values compete with the fixed nav and its menus.
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  backgroundColor: listBackground,
  paddingTop: '8px',
});

export const addCardFooter = style({
  position: 'sticky',
  bottom: 0,
  // Below the header: the list actions popover renders inside it, and an equal
  // z-index would let this footer paint over the popover's options. Still above
  // the cards, which paint at this level earlier in tree order.
  zIndex: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: listBackground,
  paddingBottom: '8px',

  selectors: {
    // While adding a card the footer rejoins the flow, so the input and its
    // buttons scroll with the cards.
    '&[data-editing]': {
      position: 'static',
    },
  },
});

export const listName = style({
  fontFamily,
  color: 'black',
  fontWeight: 700,
  fontSize: '14px',
});

export const editListNameInput = style({
  borderRadius: '8px',
  border: 'none',
  padding: '9px',
  boxShadow: '0 1px 0 #091e4240',
  fontWeight: 600,
  position: 'relative',
  marginBottom: '4px',
  fontSize: '14px',
});

export const addListButton = style({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 14,
  color: 'white',
  letterSpacing: '0.05rem',
});

export const addCardButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        margin: 0,
        padding: '8px',
      },
    },
  },
]);

export const addCardText = style({
  border: 'none',
  background: 'none',
  fontFamily,
  cursor: 'pointer',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '8px',
  marginTop: '4px',
  width: '100%',
  textAlign: 'left',

  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },
});

export const addCardInput = style({
  borderRadius: '8px',
  border: 'none',
  padding: '9px',
  boxShadow: '0 1px 0 #091e4240',
  margin: '4px 0px 8px',
  width: 'stretch',
});

export const closeAddCardButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        border: 'none',
        color: 'black',
        padding: '8px',
        background: 'none',
        cursor: 'pointer',
        margin: '0 8px',
        fontWeight: 600,
      },
      [`&${button}:hover`]: {
        backgroundColor: 'rgba(0, 0, 0, .3)',
      },
    },
  },
]);

export const listCardContainer = style({
  position: 'relative',
  borderRadius: '8px',
  background: '#fff',
  fontFamily,
  fontSize: '14px',
  padding: '8px',
  boxShadow: '0 1px 0 #091e4240',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '8px',
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,

  selectors: {
    "&[role='button']": {
      cursor: 'pointer',
    },
    "&[role='button']:focus": {
      outline: `2px solid ${focusRingBlue}`,
      outlineOffset: '-2px',
    },
  },
});

export const listCardSkeleton = style([
  listCardContainer,
  {
    background: 'rgba(9, 30, 66, 0.25)',
    cursor: 'default',
    pointerEvents: 'none',
    minHeight: '16px',
    ...animationStyles.pulse,
  },
]);

export const listHeaderSkeletonRow = style({
  display: 'flex',
  justifyContent: 'space-between',
});

export const listCardsSkeletonRow = style({
  display: 'flex',
  flexDirection: 'column',
});

export const listNameSkeleton = style([
  listCardSkeleton,
  {
    width: '125px',
    margin: '8px 0px 12px 8px',
  },
]);

export const listCountSkeleton = style([
  listCardSkeleton,
  {
    width: '20px',
    margin: '8px 0px 12px 8px',
  },
]);

export const addListButtonSkeleton = style([
  listCardSkeleton,
  {
    margin: '8px 0px 8px 8px',
    width: '75px',
  },
]);

export const dottedLine = style({
  position: 'relative',
  top: '3px',
  flex: '50%',
  width: '100%',
  height: 0,
  borderTop: '2px dashed #b3b9c4',
});

export const addNewCardAtPositionContainer = style({
  position: 'relative',
  minHeight: '8px',
  height: 'auto',
  cursor: 'pointer',
});

export const addNewCardAtPositionPlus = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '12px',
  background: '#fff',
  padding: '2px 6px 0px',
  color: 'rgba(0, 0, 0, 0.7)',
  boxShadow: '0.5px 0.5px 0.5px 0.5px #091e4240',
  border: activityFieldStyles.border,
  borderRadius: '5px',
  zIndex: 1,
});
