import { Link } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import { TiDelete } from 'react-icons/ti';
import { css, styled } from 'styled-components';
import { animationStyles } from '~/styles/animations';
import {
  blue,
  darkGray,
  fontFamily,
  getBoardGradientHoverVars,
  getBoardGradientVars,
  green,
  lightGreen,
  orange,
  red,
} from '~/styles/tokens';

export { blue, darkGray, fontFamily, green, lightGreen, orange, red };

export type BoardBackground =
  | 'green'
  | 'lightGreen'
  | 'blue'
  | 'orange'
  | 'red';

export type BackgroundProps = {
  $background?: BoardBackground;
};

export const BoardsContainer = styled.div` 
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 50px 30px 30px;
`;

export const BoardCardLink = styled(Link)<BackgroundProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  border: none;
  margin: 10px;
  padding: 0;
  overflow: hidden;
  width: 100%;
  max-width: 15%;
  min-width: 200px;
  height: 110px;
  border-radius: 8px;
  box-shadow: 0 1px 0.5px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.12);
  font-family: ${fontFamily};
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  color: black;
  background: ${({ $background }) => getBoardGradientVars($background)};

  &:hover {
    background: ${({ $background }) => getBoardGradientHoverVars($background)};
  }

  &:focus {
    background: ${({ $background }) => getBoardGradientHoverVars($background)};
  }
`;

export const CreateBoardContainer = styled.div<BackgroundProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  border: none;
  margin: 10px;
  padding: 0;
  overflow: hidden;
  width: 100%;
  max-width: 15%;
  min-width: 200px;
  height: 110px;
  border-radius: 8px;
  box-shadow: 0 1px 0.5px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.12);
  font-family: ${fontFamily};
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  color: black;
  background: ${({ $background }) => getBoardGradientVars($background)};

  &:hover {
    background: ${({ $background }) => getBoardGradientHoverVars($background)};
  }

  &:focus {
    background: ${({ $background }) => getBoardGradientHoverVars($background)};
  }
`;

export type BoardCardTitleProps = {
  isCreateBoard?: boolean;
};

export const BoardCardTitle = styled.div<BoardCardTitleProps>`
  font-size: 14px;
  background: #fff;
  padding: 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  @media (max-width: 660px) {
    padding: 6px;
    text-align: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const BoardCardSkeleton = styled(CreateBoardContainer)`
  background: rgba(9, 30, 66, 0.25);
  cursor: default;
  pointer-events: none;
  ${animationStyles.pulse}
`;

export const CreateBoardCard = styled(CreateBoardContainer)` 
  background: rgba(9, 30, 66, 0.04);
  max-height: 100px;
  padding-bottom: 10px;
  justify-content: center;
  text-align: center;
  &:hover {
    background: rgba(9, 30, 66, 0.08); 
  }

  &:active {
    background: #e4f0f6;
    color: #0079bf;
  }
`;

export const CreateBoardPopoverTrigger = styled(Popover.Trigger)` 
  background: transparent;
  border: none;
  color: inherit;
  width: max-content; 
  min-width: 125px;
`;

export const PopoverClose = styled(Popover.Close)` 
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  position: absolute;
  right: 8px;
  margin: 0px 4px 4px 4px;

  &:hover {
    background: rgba(0,0,0, 0.1);
    border-radius: 4px;
  }
`;

export const CreateBoardPopoverContent = styled(Popover.Content)` 
  height: auto;
  width: 225px;
  border: 2px solid rgba(9, 30, 66, 0.08);
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  padding: 10px 25px 25px 25px;
`;

export const CreateBoardPopoverHeader = styled.div` 
  display: flex;
  justify-content: center;
  color: rgba(9, 30, 66, .75);
  font-weight: 700;
`;

export const CreateBoardCloseBorder = styled.hr` 
  margin: 5px;
`;

export const CreateBoardBackgroundText = styled.div` 
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
`;

export const CreateBoardBackgroundChoices = styled.div` 
  display: flex;
  flex-wrap: wrap;
`;

export const CreateBoardBackgroundChoice = styled('div')<BackgroundProps>`
 width: 40px;
 height: 32px;
 border-radius: 5px;
 margin: 5px;
 position: relative;
 cursor: pointer;
 background: ${({ $background }) => getBoardGradientVars($background)};

  &:hover {
    background: ${({ $background }) => getBoardGradientHoverVars($background)};
  }
`;

export const CreateBoardTitleInput = styled.input`
  width: 200px;
  margin: 5px;
  height: 20px;
`;

type CreateBoardButtonProps = {
  disabled: boolean;
};

export const CreateBoardButton = styled.button<CreateBoardButtonProps>`
  border: none;
  border-radius: 5px;
  width: 200px;
  height: 20px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;

  ${({ disabled }) =>
    disabled
      ? css`
      background: rgba(9, 30, 66, 0.04);
      color: rgba(9, 30, 66, 0.08);
    `
      : css`
      background: ${blue};
      color: #fff;
    `}
`;

export const DeleteBoardIcon = styled(TiDelete)` 
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 15px 10px;
`;
