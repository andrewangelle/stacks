export const darkGray = '#5e6c84';
export const green = '#519839';
export const lightGreen = '#4bbf6b';
export const blue = '#0079bf';
export const orange = '#d29034';
export const red = '#b04632';
export const checklistProgressBlue = '#5ba4cf';
export const focusRingBlue = '#2F80ED';
export const fontFamily =
  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;';

/** References gradients in `board-gradient.css` — edit that file to tune. */
export const boardGradientVars = {
  green: 'var(--board-gradient-green)',
  lightGreen: 'var(--board-gradient-light-green)',
  blue: 'var(--board-gradient-blue)',
  orange: 'var(--board-gradient-orange)',
  red: 'var(--board-gradient-red)',
} as const;

export const boardGradientHoverVars = {
  green: 'var(--board-gradient-green-hover)',
  lightGreen: 'var(--board-gradient-light-green-hover)',
  blue: 'var(--board-gradient-blue-hover)',
  orange: 'var(--board-gradient-orange-hover)',
  red: 'var(--board-gradient-red-hover)',
} as const;
