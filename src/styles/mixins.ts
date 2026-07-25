import type { ComplexStyleRule } from '@vanilla-extract/css';

export const secondaryButtonStyles = {
  background: 'transparent',
  color: 'rgba(9, 30, 66, 0.9)',
  border: '1px solid rgba(9, 30, 66, 0.2)',
  cursor: 'pointer',
  fontWeight: 600,

  ':hover': {
    background: 'rgba(9, 30, 66, 0.04)',
    color: 'rgba(9, 30, 66, 0.9)',
  },
} satisfies ComplexStyleRule;

/**
 * The tint layer every button-like control paints over itself. Only the shared
 * `button` base ever raises its opacity on hover; the popover buttons declare
 * the layer without a trigger.
 */
export const hoverOverlay = {
  content: '""',
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  backgroundColor: '#000',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.15s ease',
} satisfies ComplexStyleRule;

export const disabledButtonStyles = {
  background: 'rgba(9, 30, 66, 0.02)',
  color: 'rgba(9, 30, 66, 0.2)',
  border: '1px solid rgba(9, 30, 66, 0.2)',
  cursor: 'not-allowed',
} satisfies ComplexStyleRule;

export const activityFieldStyles = {
  border: '0.05px solid rgba(9, 30, 66, 0.2)',
  borderRadius: '8px',
  padding: '8px 10px',
  boxShadow: '0 1px 0 #091e4240',
} satisfies ComplexStyleRule;
