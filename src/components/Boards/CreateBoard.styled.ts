import { type DataAttributes, styled } from 'styled-components';
import { fontFamily } from '~/components/Boards/Boards.styled';
import {
  MoveCardMenuContent,
  MoveCardMenuHeader,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { ComboboxLabel } from '~/components/shared/Combobox/Combobox.styled';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

export const CreateBoardPopoverContent = styled(
  MoveCardMenuContent,
).attrs<DataAttributes>({
  'data-testid': 'CreateBoardPopoverContent',
})``;

export const CreateBoardPopoverHeader = styled(
  MoveCardMenuHeader,
).attrs<DataAttributes>({
  'data-testid': 'CreateBoardPopoverHeader',
})``;

export const CreateBoardBackgroundText = styled(
  ComboboxLabel,
).attrs<DataAttributes>({
  'data-testid': 'CreateBoardBackgroundText',
})``;

export const CreateBoardTitleInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'CreateBoardTitleInput',
})`
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 10px 10px;
  padding: 12px 8px;
  border: 1px solid rgba(9, 30, 66, 0.8);
  border-radius: 4px;
  font-family: ${fontFamily};
  font-size: 14px;
  color: rgba(9, 30, 66, 0.95);
  outline: none;

  &:focus {
    border-color: ${focusRingBlue};
  }
`;

export const CreateBoardButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'CreateBoardButton',
})`
  width: calc(100% - 20px);
  margin: 8px 10px 10px;
  padding: 10px 20px;
  font-weight: 500;
`;
