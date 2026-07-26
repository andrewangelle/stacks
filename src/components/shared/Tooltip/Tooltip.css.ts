import { style } from '@vanilla-extract/css';

// Radix's popper wrapper is `z-index: auto`, so this positioned content stacks
// in the root context and has to clear the card modal overlay.
export const tooltipContent = style({
  position: 'relative',
  zIndex: 1002,
  color: 'white',
  backgroundColor: 'black',
  borderRadius: '4px',
  padding: '6px',
  fontSize: '12px',
  textAlign: 'center',
  textShadow: '0 1px 0 rgba(0,0,0,0.5)',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
});
