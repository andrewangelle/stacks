import { style } from '@vanilla-extract/css';

export const cardHeaderContainer = style({
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderBottom: '1px solid rgba(0,0,0, 0.2)',
});

export const cardModalClose = style({
  border: 'none',
  right: 0,
  padding: '8px 12px',
  cursor: 'pointer',
  background: 'white',
  borderRadius: '100%',

  ':hover': {
    background: 'rgba(0,0,0, 0.1)',
  },
});

export const cardPageClose = style([
  cardModalClose,
  {
    background: 'transparent',
  },
]);

export const cardModalCloseSpinnerSlot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px 4px',
  margin: '4px',
});
