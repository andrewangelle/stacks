import { styled } from '@pigment-css/react';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { CardModalTitle } from '~/components/Cards/Card.styled';
import { Button, secondaryButtonStyles } from '~/styles/Page.styled';
import { blue } from '~/styles/tokens';

export const ActivityHeader = styled.div` 
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const HideActivityButton = styled(Button)({
  ...secondaryButtonStyles,
  padding: '8px 10px',
  margin: 0,
  fontSize: '14px',

  '&:hover:not(:disabled)': {
    color: secondaryButtonStyles.color,
  },
});

export const ActivityContainer = styled.div` 
  margin: 18px 0px;
  width: 100%;
`;

export const ActivityTitle = styled(CardModalTitle)` 
  font-size: 14px;
  font-weight: 600;
`;

export const ActivityCommentContainer = styled.div` 
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: 100%;
`;

export const ActivityNameCircle = styled.div` 
  border-radius: 100%;
  background: ${blue};
  color: white;
  height: 30px;
  width: 34px;
  position: relative;
  font-size: 13px;
  font-weight: 500;
`;

export const AddActivityInput = styled.input` 
  margin: 0px 5px;
  width: stretch; 
  border: 0.05px solid rgba(9, 30, 66, 0.2);
  border-radius: 8px;
  padding: 8px 10px;
  box-shadow: 0 1px 0 #091e4240;
`;

export const AddCommentInput = styled(AddActivityInput)`
  margin: 8px 0 8px 5px;
`;

export const ActivityCommentContent = styled.div` 
  font-family: ${fontFamily};
  font-size: 14px;
  margin: 8px 0 0 5px;
  border: 0.05px solid rgba(9, 30, 66, 0.2);
  border-radius: 8px;
  padding: 8px 10px;
  background: white; 
  box-shadow: 0 1px 0 #091e4240;
`;

export const SaveCommentButton = styled(Button)` 
  padding: 8px 10px;
  margin: 8px 0 0 5px;
  font-weight: 600;
`;

export const EditCommentLink = styled.button`
  border: none;
  background: none;
  text-decoration: underline;
  cursor: pointer;
`;

export const ActivityActionsSeparator = styled.div`
  width: 4px;
  height: 4px;
  margin-left: 4px;
  background: black;
  border-radius: 100%;
`;
