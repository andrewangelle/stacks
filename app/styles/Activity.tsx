import styled from 'styled-components';

import { Button } from '~/styles';
import { fontFamily } from './Boards';

export const ActivityHeader = styled.div` 
  display: flex;
  justify-content: space-between;
  width: 70%;
`;

export const HideActivityButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  color: black;
  margin: 0;
`;

export const ActivityContainer = styled.div` 
  margin: 10px 0px;
  width: 70%;
`

export const ActivityCommentContainer = styled.div` 
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: 100%;
`;

export const ActivityNameCircle = styled.div` 
  border-radius: 50%;
  background: blue;
  color: white;
  height: 25px;
  width: 25px;
  position: relative;
  font-size: 10px;
`;

export const AddActivityInput = styled.input` 
  margin: 0px 5px;
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 8px 10px;
`;

export const ActivityCommentContent = styled.div` 
  font-family: ${fontFamily};
  font-size: 14px;
  margin: 0px 5px;
  width: 94%;
  border: none;
  border-radius: 5px;
  padding: 8px 10px;
  background: white; 
`;

export const SaveCommentButton = styled(Button)` 
  padding: 8px 10px;
  margin: 5px 0 0 30px;
`