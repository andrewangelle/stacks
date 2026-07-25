import { style } from '@vanilla-extract/css';
import { animationStyles } from '~/styles/animations';
import { button } from '~/styles/Page.css';
import { blue, focusRingBlue, fontFamily } from '~/styles/tokens';

export const selectSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '40px',
  borderRadius: '8px',
  margin: '0px 8px 8px',
  ...animationStyles.pulse,
});

export const moveCardMenuTrigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: 'none',
  background: 'rgb(221, 222, 225)',
  borderRadius: '4px',
  padding: '4px',
  fontWeight: 600,
  cursor: 'pointer',

  ':hover': {
    background: 'rgb(183, 185, 190)',
  },
});

export const moveCardMenuContent = style({
  width: '350px',
  borderRadius: '8px',
  fontFamily,
  fontSize: '14px',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  boxShadow: '0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F',
});

export const moveCardMenuHeader = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '10px',
  fontSize: '14px',
  fontWeight: 600,
  color: 'rgba(9, 30, 66, .75)',
});

export const dropdownLabel = style({
  fontFamily,
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(9, 30, 66, .75)',
  padding: '10px',
});

export const moveCardButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        padding: '10px 20px',
        alignSelf: 'flex-start',
        margin: '8px',
        fontWeight: 500,
        width: 'stretch',
      },
    },
  },
]);

export const selectTrigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  boxSizing: 'border-box',
  width: 'calc(100% - 20px)',
  margin: '0 10px 10px',
  padding: '8px',
  border: '2px solid rgba(9, 30, 66, .2)',
  borderRadius: '8px',
  background: '#fff',
  fontFamily,
  fontSize: '14px',
  color: 'rgba(9, 30, 66, .95)',
  cursor: 'pointer',
  outline: 'none',

  ':hover': {
    borderColor: 'rgba(9, 30, 66, .35)',
  },

  ':focus': {
    borderColor: focusRingBlue,
  },

  selectors: {
    "&[data-state='open']": {
      borderColor: focusRingBlue,
    },
  },
});

export const selectContent = style({
  zIndex: 1001,
  boxSizing: 'border-box',
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'var(--radix-select-content-available-height)',
  borderRadius: '8px',
  background: '#fff',
  fontFamily,
  boxShadow: '0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F',
  overflow: 'hidden',
});

export const selectViewport = style({
  padding: '4px 0',
});

export const selectLabel = style({
  padding: '12px 14px 6px',
  fontFamily,
  fontSize: '14px',
  fontWeight: 700,
  color: 'rgba(9, 30, 66, .9)',
});

export const selectItem = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: '10px 14px',
  fontSize: '14px',
  color: 'rgba(9, 30, 66, .9)',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',

  ':hover': {
    background: 'rgb(221, 222, 225)',
    boxShadow: `inset 3px 0 0 ${blue}`,
  },

  selectors: {
    '&[data-highlighted]': {
      background: 'rgb(244, 245, 247)',
    },
    "&[data-state='checked'], &[data-state='checked'][data-highlighted]": {
      background: '#E9F2FF',
      color: blue,
      boxShadow: `inset 3px 0 0 ${blue}`,
    },
  },
});

export const selectItemCurrent = style({
  fontSize: '13px',
  color: blue,
});

export const moveCardSelectRow = style({
  display: 'flex',
  alignItems: 'flex-start',
});

export const moveCardListColumn = style({
  width: '70%',
});

export const moveCardPositionColumn = style({
  width: '30%',
});

export const moveCardFieldsContainer = style({
  paddingTop: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
