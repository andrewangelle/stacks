import { style } from '@vanilla-extract/css';
import { blue, focusRingBlue, fontFamily } from '~/styles/tokens';

export const comboboxWrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const comboboxLabel = style({
  fontFamily,
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(9, 30, 66, .75)',
  padding: '0 10px 6px',
});

export const comboboxTrigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  width: 'calc(100% - 20px)',
  margin: '0 10px 10px',
  padding: '0 4px 0 8px',
  border: '1px solid rgba(9, 30, 66, 0.8)',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  position: 'relative',

  ':hover': {
    background: 'rgba(9, 30, 66, 0.02)',
  },

  ':focus-within': {
    border: `1px solid ${focusRingBlue}`,
  },
});

export const comboboxInput = style({
  flex: '1 1 auto',
  minWidth: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: '12px 0',
  fontFamily,
  fontSize: '14px',
  color: 'rgba(9, 30, 66, .95)',
  cursor: 'pointer',

  '::placeholder': {
    color: 'rgba(9, 30, 66, .95)',
  },
});

export const comboboxIconButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  padding: '4px',
  cursor: 'pointer',
  color: 'rgba(9, 30, 66, .75)',
  borderRadius: '4px',

  ':hover': {
    background: 'rgb(244, 245, 247)',
  },
});

export const comboboxMenu = style({
  position: 'absolute',
  top: '75px',
  listStyle: 'none',
  boxSizing: 'border-box',
  width: 'calc(100% - 20px)',
  margin: '-6px 10px 10px',
  padding: '4px 0',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F',
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1001,
});

export const comboboxItem = style({
  position: 'relative',
  padding: '10px 14px',
  fontFamily,
  fontSize: '14px',
  color: 'rgba(9, 30, 66, .9)',
  cursor: 'pointer',
  userSelect: 'none',

  selectors: {
    "&[data-highlighted='true']": {
      background: 'rgb(244, 245, 247)',
    },
    "&[data-selected='true']": {
      background: '#E9F2FF',
      color: blue,
      boxShadow: `inset 3px 0 0 ${blue}`,
    },
  },
});

export const comboboxItemCurrent = style({
  fontSize: '13px',
  color: blue,
});
