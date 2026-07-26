import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animationStyles } from '~/styles/animations';
import { secondaryButtonBase, secondaryButtonHover } from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import { blue, cardModalContentIndent, fontFamily, red } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const addChecklistItemButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        ...secondaryButtonBase,
        padding: '8px 10px',
        margin: `12px 0px 0px ${cardModalContentIndent}`,
        fontSize: '14px',
        color: 'rgba(9, 30, 66, 0.725)',
        border: '1px solid rgba(9, 30, 66, 0.2)',
      },
      [`&${button}:hover`]: secondaryButtonHover,
      [`&${button}:hover:not(:disabled)`]: {
        color: secondaryButtonBase.color,
      },
    },
  },
]);

export const addChecklistItemInput = style({
  height: '30px',
  width: '100%',
  fontSize: '14px',
  padding: '15px',
  borderRadius: '8px',
  margin: '8px 0px',
  border: 'none',
  fontFamily,
  backgroundColor: 'rgba(0, 0, 0, 0.03)',

  ':focus': {
    backgroundColor: '#fff',
  },
});

export const addChecklistItemInputIndented = style([
  addChecklistItemInput,
  {
    margin: `8px 0px 8px ${cardModalContentIndent}`,
  },
]);

export const checklistItemActions = style({
  display: 'flex',
});

export const checklistItemActionsIndented = style([
  checklistItemActions,
  {
    marginLeft: cardModalContentIndent,
  },
]);

export const checkboxIndicator = style({
  color: 'white',
});

export const checkboxLabel = recipe({
  base: {
    fontFamily,
    fontSize: '14px',
    width: '80%',
    cursor: 'pointer',
    wordWrap: 'break-word',
    background: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left',
  },
  variants: {
    checked: {
      true: { textDecoration: 'line-through' },
      false: { textDecoration: 'none' },
    },
  },
});

export const editChecklistItemContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '85%',
});

export const addChecklistButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        padding: '8px 10px',
        margin: '0 10px 0 0px',
      },
    },
  },
]);

export const deleteChecklistPopoverButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        background: red,
        width: '100%',
        margin: '15px 0px 0px',
        padding: '8px 10px',
      },
    },
  },
]);

export const checklistLeadingColumn = style({
  display: 'flex',
  justifyContent: 'flex-start',
});

export const checklistContentColumn = style({
  minWidth: 0,
});

export const checklistCheckboxContentColumn = recipe({
  base: [
    checklistContentColumn,
    {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      minHeight: '25px',
    },
  ],
  variants: {
    isHovering: {
      true: {
        background: 'rgba(0,0,0,0.1)',
        cursor: 'pointer',
        borderRadius: '8px',
      },
    },
  },
});

export const checklistCheckboxContainer = style({
  display: 'grid',
  gridTemplateColumns: checklistRowColumns,
  position: 'relative',
  cursor: 'pointer',
});

export const checkboxRoot = recipe({
  base: {
    width: '16px',
    height: '16px',
    verticalAlign: 'top',
    top: '12px',
    position: 'relative',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    border: '2px solid rgba(9, 30, 66, 0.35)',
    borderRadius: '3px',

    selectors: {
      '&[data-editing]': {
        top: '30px',
      },
    },
  },
  variants: {
    checked: {
      true: {
        backgroundColor: blue,
        color: 'white',
        borderColor: blue,
        borderBlockColor: blue,
        borderRadius: '3px',
      },
    },
  },
});

export const checklistItemOptionsPopoverTrigger = style({
  background: 'transparent',
  cursor: 'pointer',
  height: '100%',
  border: '1px solid rgba(0,0,0,0.2)',
  borderRadius: '100%',

  ':hover': {
    position: 'relative',
    background: 'rgba(0,0,0,0.1)',
  },

  selectors: {
    "&[data-state='open']": {
      background: 'black',
    },
  },
});

export const deleteChecklistPopoverTrigger = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  height: '100%',
});

export const checklistItemOptionsEllipsis = style({
  position: 'relative',
  top: '1px',
});

export const checklistItemSkeletonContainer = style({});

export const checkboxSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '18px',
  height: '10px',
  borderRadius: '2px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const checklistLabelSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '18px',
  height: '10px',
  borderRadius: '2px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const addChecklistButtonSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '100%',
  height: '8px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  margin: '12px 0',
  ...animationStyles.pulse,
});

export const checklistItemOptionsListContainer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const checklistItemOptionsListItem = style({
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
