import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { cardModalTitle } from '~/components/Cards/Card.css';
import { animationStyles } from '~/styles/animations';
import {
  activityFieldStyles,
  secondaryButtonBase,
  secondaryButtonHover,
} from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import {
  activitySidebarQuery,
  completedGreen,
  fontFamily,
  userNameIconBlue,
} from '~/styles/tokens';

export const activityPanelContainer = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
});

/**
 * The virtualizer's scroll element. It has to own its scrolling in both
 * layouts: in the sidebar it fills whatever height the activity column was
 * given, and on narrow screens — where the column itself stops scrolling and
 * the modal body takes over — it falls back to a viewport-relative height so
 * the list still has a measurable box to virtualize against.
 */
export const activityListViewport = style({
  position: 'relative',
  boxSizing: 'border-box',
  flex: '1 1 auto',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  maxHeight: '60vh',

  '@media': {
    [activitySidebarQuery]: {
      maxHeight: 'none',
    },
  },
});

export const activityListContainer = style({
  position: 'relative',
  width: '100%',
});

export const activityListRow = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
});

export const activityHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '8px',
  boxSizing: 'border-box',
  minWidth: 0,
  width: '100%',
  padding: '12px',

  '@media': {
    [activitySidebarQuery]: {
      padding: '12px 12px 8px 8px',
    },
  },
});

export const hideActivityButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        ...secondaryButtonBase,
        padding: '8px 10px',
        margin: 0,
        fontSize: '14px',
        flexShrink: 0,
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

export const addCommentContainer = style({
  boxSizing: 'border-box',
  margin: '18px 0',
  padding: '0 12px',
  borderLeft: '4px solid transparent',
  minWidth: 0,
  width: '100%',

  '@media': {
    [activitySidebarQuery]: {
      padding: '0 12px 0 8px',
    },
  },
});

export const activityContainer = recipe({
  base: {
    boxSizing: 'border-box',
    padding: '18px 12px',
    minWidth: 0,
    width: '100%',

    '@media': {
      [activitySidebarQuery]: {
        padding: '8px 12px 8px 8px',
      },
    },
  },
  variants: {
    isSelected: {
      true: {
        background: '#D3E4F4',
        borderLeft: '4px solid #0C66E4',
      },
      false: {
        background: 'transparent',
        borderLeft: '4px solid transparent',
      },
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export const activityRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  boxSizing: 'border-box',
  minWidth: 0,
  width: '100%',
});

export const activityTitle = style([
  cardModalTitle,
  {
    selectors: {
      [`&${cardModalTitle}`]: {
        fontSize: '14px',
        fontWeight: 600,
        margin: 0,
        minWidth: 0,
      },
    },
  },
]);

export const activityHeaderTitle = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '4px',
  flex: 1,
  minWidth: 0,
});

export const activityCommentContainer = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  fontSize: '12px',
});

export const addCommentForm = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  fontSize: '12px',
});

export const activityMeta = style({
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
});

export const activityAuthorName = style({
  fontWeight: 700,
  fontSize: '14px',
});

export const activityMetaTime = style({
  marginLeft: '4px',
  cursor: 'pointer',
  textDecoration: 'underline',
  color: '#0000EE',
});

export const activityNameCircle = style({
  borderRadius: '100%',
  background: userNameIconBlue,
  color: 'white',
  flexShrink: 0,
  height: '32px',
  width: '32px',
  position: 'relative',
  fontSize: '13px',
  fontWeight: 500,
});

export const addCommentInput = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  ...activityFieldStyles,
});

export const activityCommentContent = style({
  boxSizing: 'border-box',
  fontFamily,
  fontSize: '14px',
  marginTop: '8px',
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  background: 'white',
  ...activityFieldStyles,
});

export const activityEntryContent = style({
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
});

export const editCommentActionsRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '8px',
});

export const saveCommentButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        padding: '8px 10px',
        margin: 0,
        fontWeight: 600,
      },
    },
  },
]);

export const editCommentLink = style({
  border: 'none',
  background: 'none',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
});

export const editCommentActionsSeperator = style({
  width: '3.5px',
  height: '3.5px',
  background: 'black',
  borderRadius: '100%',
  flexShrink: 0,
  position: 'relative',
  top: '1px',
});

export const activityTimestampMeta = style({
  display: 'block',
  background: 'transparent',
  border: 'none',
  padding: 0,
  marginTop: '4px',
  cursor: 'pointer',
  textDecoration: 'underline',
  color: '#0000EE',
  fontSize: '14px',
  fontFamily,
});

export const activityLinkToCard = style({
  display: 'inline-block',
  background: 'transparent',
  border: 'none',
  padding: 0,
  marginTop: '4px',
  cursor: 'pointer',
  textDecoration: 'underline',
  color: '#0000EE',
  fontSize: '14px',
  fontFamily,
});

export const commentTimestamp = style({
  display: 'inline',
  margin: '0px 0px 0px 5px',
});

export const activityLogoSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  borderRadius: '100%',
  flexShrink: 0,
  height: 32,
  width: 32,
  position: 'relative',
  ...animationStyles.pulse,
});

export const activityContentSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  borderRadius: '8px',
  flexShrink: 0,
  height: 14,
  width: '100%',
  position: 'relative',
  ...animationStyles.pulse,
});

export const activityTimestampSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  borderRadius: '8px',
  flexShrink: 0,
  height: 14,
  width: '25%',
  position: 'relative',
  ...animationStyles.pulse,
});

export const paperclipReveal = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    transition:
      'max-width 350ms ease, opacity 350ms ease, transform 350ms ease',
  },
  variants: {
    isVisible: {
      true: {
        maxWidth: '20px',
        opacity: 1,
        transform: 'translateX(0)',
      },
      false: {
        maxWidth: '0px',
        opacity: 0,
        transform: 'translateX(-6px)',
      },
    },
  },
  defaultVariants: {
    isVisible: false,
  },
});

export const activityCopiedCheckmark = style({
  backgroundColor: 'transparent',
  border: `1px solid ${completedGreen}`,
  borderRadius: '100%',
  flexShrink: 0,
  height: 10,
  width: 10,
  position: 'relative',
  color: completedGreen,
  display: 'inline-flex',
  margin: '0 0 0 4px',
});
