import { styled } from '@pigment-css/react';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { CardModalTitle } from '~/components/Cards/Card.styled';
import { animationStyles } from '~/styles/animations';
import { Button, secondaryButtonStyles } from '~/styles/Page.styled';
import { completedGreen, userNameIconBlue } from '~/styles/tokens';

const activitySidebarLayout = '@media (min-width: 851px)';

export const ActivityPanel = styled.div`
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
`;

export const ActivityHeader = styled.div` 
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  padding: 12px;

  ${activitySidebarLayout} {
    padding: 12px 12px 8px 8px;
  }
`;

export const HideActivityButton = styled(Button)({
  ...secondaryButtonStyles,
  padding: '8px 10px',
  margin: 0,
  fontSize: '14px',
  flexShrink: 0,
  color: 'rgba(9, 30, 66, 0.725)',
  border: '1px solid rgba(9, 30, 66, 0.2)',

  '&:hover:not(:disabled)': {
    color: secondaryButtonStyles.color,
  },
});

type ActivityContainerProps = {
  isSelected?: boolean;
};

export const AddCommentContainer = styled.div`
  box-sizing: border-box;
  margin: 18px 0;
  padding: 0 12px;
  border-left: 4px solid transparent;
  min-width: 0;
  width: 100%;

  ${activitySidebarLayout} {
    padding: 0 12px 0 8px;
  }
`;

export const ActivityContainer = styled.div<ActivityContainerProps>({
  boxSizing: 'border-box',
  padding: '18px 12px',
  minWidth: 0,
  width: '100%',

  background: ({ isSelected }) => (isSelected ? '#D3E4F4' : 'transparent'),
  borderLeft: ({ isSelected }) =>
    isSelected ? '4px solid #0C66E4' : '4px solid transparent',

  [activitySidebarLayout]: {
    padding: '8px 12px 8px 8px',
  },
});

export const ActivityRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
`;

export const ActivityTitle = styled(CardModalTitle)` 
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  min-width: 0;
`;

export const ActivityHeaderTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const ActivityCommentContainer = styled.div` 
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  font-size: 12px;
`;

export const AddCommentForm = styled.form` 
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  font-size: 12px;
`;

export const ActivityMeta = styled.div`
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

export const ActivityAuthorName = styled.span`
  font-weight: 700;
  font-size: 14px;
`;

export const ActivityMetaTime = styled.span`
  margin-left: 4px;
  cursor: pointer;
  text-decoration: underline;
  color: #0000EE;
`;

export const ActivityNameCircle = styled.div` 
  border-radius: 100%;
  background: ${userNameIconBlue};
  color: white;
  flex-shrink: 0;
  height: 32px;
  width: 32px;
  position: relative;
  font-size: 13px;
  font-weight: 500;
`;

export const activityFieldStyles = {
  border: '0.05px solid rgba(9, 30, 66, 0.2)',
  borderRadius: '8px',
  padding: '8px 10px',
  boxShadow: '0 1px 0 #091e4240',
};

export const AddCommentInput = styled.input` 
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  border: ${activityFieldStyles.border};
  border-radius: ${activityFieldStyles.borderRadius};
  padding: ${activityFieldStyles.padding};
  box-shadow: ${activityFieldStyles.boxShadow};
`;

export const ActivityCommentContent = styled.div` 
  box-sizing: border-box;
  font-family: ${fontFamily};
  font-size: 14px;
  margin-top: 8px;
  max-width: 100%;
  overflow-wrap: anywhere;
  border: ${activityFieldStyles.border};
  border-radius: ${activityFieldStyles.borderRadius};
  padding: ${activityFieldStyles.padding};
  background: white; 
  box-shadow: ${activityFieldStyles.boxShadow};
`;

export const ActivityEntryContent = styled.div`
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

export const EditCommentActionsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

export const SaveCommentButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0;
  font-weight: 600;
`;

export const EditCommentLink = styled.button`
  border: none;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
  color: inherit;
`;

export const DeleteCommentLink = styled(EditCommentLink)``;

export const EditCommentActionsSeperator = styled.div`
  width: 3.5px;
  height: 3.5px;
  background: black;
  border-radius: 100%;
  flex-shrink: 0;
  position: relative;
  top: 1px;
`;

export const ActivityTimestampMeta = styled.div`
  margin-top: 4px;
  cursor: pointer;
  text-decoration: underline;
  color: #0000EE;
`;

export const ActivityLinkToCard = styled.span`
  margin-top: 4px;
  cursor: pointer;
  text-decoration: underline;
  color: #0000EE;
`;

export const CommentTimestamp = styled(ActivityTimestamp)`
  display: inline;
  margin: 0px 0px 0px 5px;
`;

export const ActivityLogoSkeleton = styled.div({
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

export const ActivityContentSkeleton = styled.div({
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

export const ActivityTimestampSkeleton = styled.div({
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

export const PaperclipReveal = styled.span<{ isVisible?: boolean }>({
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  maxWidth: ({ isVisible }) => (isVisible ? '20px' : '0px'),
  opacity: ({ isVisible }) => (isVisible ? 1 : 0),
  transform: ({ isVisible }) =>
    isVisible ? 'translateX(0)' : 'translateX(-6px)',
  transition: 'max-width 350ms ease, opacity 350ms ease, transform 350ms ease',
});

export const ActivityCopiedCheckmark = styled.span({
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
