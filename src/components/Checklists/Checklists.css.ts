import { style } from '@vanilla-extract/css';
import {
  cardModalTitle,
  editCardTitleInput,
} from '~/components/Cards/Card.css';
import { animationStyles } from '~/styles/animations';
import { secondaryButtonBase, secondaryButtonHover } from '~/styles/mixins';
import { button } from '~/styles/Page.css';
import { cardModalContentIndent, fontFamily } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const checklistsContainer = style({
  margin: '30px 12px 0px',
});

export const checklistContainer = style({
  margin: '30px 0px',
});

export const checklistPopoverContent = style({
  width: '304px',
  borderRadius: '8px',
  fontFamily,
  fontSize: '14px',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  boxShadow: '0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F',
});

export const checklistItemOptionsContent = style([
  checklistPopoverContent,
  {
    height: '130px',
    padding: '10px',
  },
]);

export const checklistPopoverHeader = style({
  fontWeight: 600,
  display: 'flex',
  justifyContent: 'center',
  color: 'rgba(9, 30, 66, .75)',
  padding: '10px',
});

export const createChecklistTitle = style({
  fontFamily,
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(9, 30, 66, .75)',
  padding: '10px',
});

export const createChecklistInput = style({
  padding: '8px 12px',
  border: 'none',
  boxShadow: 'inset 0 0 0 2px #dfe1e6',
  backgroundColor: '#fafbfc',
  margin: '8px',
  width: 'initial',
});

export const createChecklistAddButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        padding: '10px 20px',
        alignSelf: 'flex-start',
        margin: '8px',
      },
    },
  },
]);

export const deleteChecklistButtonSize = style({
  fontSize: '14px',
});

export const checklistHeaderActions = style({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
});

export const toggleCheckedItemsButton = style([
  button,
  {
    selectors: {
      [`&${button}`]: {
        ...secondaryButtonBase,
        color: 'rgba(9, 30, 66, 0.725)',
        border: '1px solid rgba(9, 30, 66, 0.2)',
        padding: '8px 10px',
        margin: 0,
        fontSize: '14px',
        flexShrink: 0,
      },
      [`&${button}:hover`]: secondaryButtonHover,
      [`&${button}:hover:not(:disabled)`]: {
        color: secondaryButtonBase.color,
      },
    },
  },
]);

export const allItemsCompleteMessage = style({
  color: '#5e6c84',
  fontSize: '14px',
  margin: `8px 0 8px ${cardModalContentIndent}`,
});

export const checklistHeader = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
});

export const checklistProgressIndicator = style({
  height: '100%',
  transition: 'width 660ms cubic-bezier(0.65, 0, 0.35, 1)',
});

export const checklistProgressRoot = style({
  position: 'relative',
  overflow: 'hidden',
  background: '#091e4214',
  borderRadius: '99999px',
  height: '8px',
  width: '100%',
  margin: '15px 0',
});

export const checklistProgressRow = style({
  display: 'grid',
  gridTemplateColumns: checklistRowColumns,
  alignItems: 'flex-start',
  position: 'relative',
});

export const checklistProgressPercentage = style({
  color: '#5e6c84',
  fontSize: '11px',
  width: '32px',
  marginTop: '12px',
});

export const checklistTitle = style([
  cardModalTitle,
  {
    selectors: {
      [`&${cardModalTitle}`]: {
        fontSize: '14px',
        minWidth: 0,
        overflowWrap: 'anywhere',
      },
    },
  },
]);

export const editChecklistTitleInput = style([
  editCardTitleInput,
  {
    selectors: {
      [`&${editCardTitleInput}`]: {
        fontSize: '14px',
      },
    },
  },
]);

export const checklistNameSkeletonContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const checklistNameSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '75px',
  height: '24px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const deleteChecklistSkeleton = style({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '60px',
  height: '32px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const checklistProgressSkeleton = style({
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
