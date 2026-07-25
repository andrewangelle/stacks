import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { listCardSkeleton } from '~/components/Lists/List.css';
import { blue, darkGray, focusRingBlue, fontFamily } from '~/styles/tokens';

const circleSizeDefault = '15px';

export const circleSizeVar = createVar();

export const listCardTitleDetailsContainer = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    wordBreak: 'break-word',
  },
  variants: {
    isCompleted: {
      true: { color: 'rgba(0, 0, 0, 0.5)' },
      false: { color: 'inherit' },
    },
  },
});

export const cardCompletedIndicatorCircle = style({
  vars: {
    [circleSizeVar]: circleSizeDefault,
  },
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: 0,
  height: circleSizeVar,
  marginRight: 0,
  padding: 0,
  borderRadius: '50%',
  border: `1.5px solid ${darkGray}`,
  backgroundColor: 'transparent',
  color: '#fff',
  opacity: 0,
  overflow: 'hidden',
  cursor: 'pointer',
  transition:
    'opacity 250ms ease, width 250ms ease, margin-right 250ms ease, background-color 250ms ease, border-color 250ms ease',

  alignSelf: 'center',

  selectors: {
    // Reveal on hover/focus of the card (data-visible) or when this control
    // itself receives keyboard focus.
    '&[data-visible], &:focus-visible': {
      width: circleSizeVar,
      marginRight: '6px',
      opacity: 1,
    },
    '&:focus-visible': {
      outline: `2px solid ${focusRingBlue}`,
      outlineOffset: '1px',
    },
    '&[data-completed]': {
      width: circleSizeVar,
      marginRight: '6px',
      opacity: 1,
      backgroundColor: '#6A9A23',
      borderColor: '#6A9A23',
    },
  },
});

export const cardTitleDetailsChecklistTotalsContainer = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    margin: '2px 0px 0px 2px',
    padding: '2px 4px 2px 3px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '16px',
    cursor: 'pointer',
    userSelect: 'none',

    ':hover': {
      backgroundColor: 'rgba(0, 85, 204, 0.12)',
    },
  },
  variants: {
    isOpen: {
      true: {
        backgroundColor: 'rgba(0, 85, 204, 0.12)',
        color: '#0055cc',
      },
    },
    isAllCompleted: {
      true: {
        backgroundColor: '#5B7F24',
        color: '#fff',
        ':hover': {
          backgroundColor: '#5B7F24',
          cursor: 'default',
        },
      },
    },
  },
});

export const cardTitleDetailsChecklistDivider = style({
  width: '100%',
  height: '1px',
  margin: '6px 0 4px',
  background: 'rgba(9, 30, 66, 0.13)',
});

export const cardTitleDetailsChecklistAccordionRoot = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const cardTitleDetailsChecklistAccordionItem = style({
  width: '100%',
});

export const cardTitleDetailsChecklistAccordionHeader = style({
  margin: 0,
});

export const cardTitleDetailsChecklistAccordionChevron = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: '#44546f',
  transition: 'transform 150ms ease',
});

export const cardTitleDetailsChecklistAccordionTrigger = style({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: '100%',
  padding: '4px 2px',
  borderRadius: '3px',
  fontFamily,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#172b4d',
  cursor: 'pointer',

  ':hover': {
    background: 'rgba(9, 30, 66, 0.08)',
  },

  ':focus': {
    outline: `2px solid ${focusRingBlue}`,
    outlineOffset: '1px',
    borderRadius: '2px',
  },
});

globalStyle(
  `${cardTitleDetailsChecklistAccordionTrigger}[data-state='open'] > span:first-of-type`,
  {
    transform: 'rotate(90deg)',
  },
);

export const cardTitleDetailsChecklistAccordionTitle = style({
  flex: 1,
  minWidth: 0,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontSize: '12px',
});

export const cardTitleDetailsChecklistAccordionCount = style({
  flexShrink: 0,
  color: '#44546f',
  fontWeight: 400,
  fontSize: '12px',
  letterSpacing: '0.07rem',
});

const cardTitleChecklistSlideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const cardTitleChecklistSlideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

export const cardTitleDetailsChecklistAccordionContent = style({
  overflow: 'hidden',

  selectors: {
    "&[data-state='open']": {
      animation: `${cardTitleChecklistSlideDown} 150ms ease-out`,
    },
    "&[data-state='closed']": {
      animation: `${cardTitleChecklistSlideUp} 150ms ease-out`,
    },
  },
});

export const cardTitleDetailsChecklistContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: '2px 0 4px 4px',
  width: 'stretch',
});

export const cardTitleDetailsChecklistItemRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '2px 0',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#172b4d',
});

export const cardTitleDetailsChecklistCheckbox = recipe({
  base: {
    width: '14px',
    height: '14px',
    flexShrink: 0,
    marginTop: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    border: '1px solid rgba(9, 30, 66, 0.5)',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  variants: {
    checked: {
      true: {
        backgroundColor: blue,
        borderColor: blue,
        color: '#fff',
      },
    },
  },
});

export const cardTitleDetailsChecklistCheckboxIndicator = style({
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const cardTitleDetailsChecklistItemLabel = style({
  minWidth: 0,
  wordBreak: 'break-word',
  textAlign: 'left',
  fontSize: '12px',
});

export const cardTitleDetailsChecklistShowMore = style({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-block',
  marginTop: '6px',
  padding: '2px 0',
  fontSize: '12px',
  textDecoration: 'none',
  fontWeight: 400,
  lineHeight: '16px',
  color: 'rgba(0, 0, 0, 0.8)',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'underline',
  },

  ':focus-visible': {
    outline: `2px solid ${focusRingBlue}`,
    outlineOffset: '1px',
    borderRadius: '2px',
  },
});

export const cardTitleDetailsContentIconsContainer = recipe({
  base: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  variants: {
    hasComments: {
      true: { paddingLeft: '2px' },
      false: { paddingLeft: 0 },
    },
  },
});

export const cardTitleDetailsSpinnerContainer = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'inherit',
  background: 'rgba(255, 255, 255, 0.72)',
  zIndex: 1,
});

const cardTitleDetailsSpin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const cardTitleDetailsSpinner = style({
  width: '16px',
  height: '16px',
  border: '2px solid rgba(9, 30, 66, 0.15)',
  borderTopColor: blue,
  borderRadius: '50%',
  animation: `${cardTitleDetailsSpin} 0.6s linear infinite`,
});

// listCardSkeleton is itself a composition, so its value is a space-joined
// class list; the specificity bump must target only its own (first) class.
const listCardSkeletonOwnClass = listCardSkeleton.split(' ')[0];

export const cardTitleDetailsContentSkeleton = style([
  listCardSkeleton,
  {
    selectors: {
      [`&${listCardSkeletonOwnClass}`]: {
        width: '50px',
        marginTop: '4px',
      },
    },
  },
]);

const allTasksCompletedReveal = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-4px) scale(0.95)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
});

export const allTasksCompletedContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  width: 'stretch',
  animation: `${allTasksCompletedReveal} 250ms ease-out`,
});

export const allTasksCompletedText = style({
  minWidth: 0,
  wordBreak: 'break-word',
  textAlign: 'left',
  fontSize: '12px',
});
