import { style } from '@vanilla-extract/css';
import { blue, fontFamily } from '~/styles/tokens';

export const center = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const flexColumn = style({
  display: 'flex',
  flexDirection: 'column',
  margin: '10px auto',
});

export const flex = style({
  display: 'flex',
});

export const flexCenter = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

export const button = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  background: blue,
  color: '#fff',
  border: 'none',
  cursor: 'pointer',

  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: '#000',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.15s ease',
  },

  selectors: {
    '&:hover:not(:disabled)::before': {
      opacity: 0.1,
    },
    '&:disabled': {
      background: 'rgba(9, 30, 66, 0.02)',
      color: 'rgba(9, 30, 66, 0.2)',
      border: '1px solid rgba(9, 30, 66, 0.2)',
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      color: 'white',
    },
  },
});

export const logoLink = style({
  textDecoration: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: 'unset',
});

export const logoIconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
});

export const popoverOptionsContent = style({
  width: '304px',
  borderRadius: '8px',
  fontFamily,
  fontSize: '14px',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  boxShadow: '0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F',
  padding: '10px 0px',
});

export const popoverOptionsContentContainer = style({
  padding: '0px 10px',
});
