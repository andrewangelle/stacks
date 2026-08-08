import { css, type DataAttributes, styled } from 'styled-components';
import type {
  BackgroundProps,
  BoardBackground,
} from '~/components/Boards/Boards.styled';
import {
  fixedChromeOffset,
  fontFamily,
  getBoardBarVars,
  getBoardGradientVars,
  getBoardNavVars,
} from '~/styles/tokens';

const navSolidBackgroundTransition = css`
  transition: background-color 0.35s ease-out;
  animation: nav-background-flash 0.45s ease-out;
`;

export const NavBarContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'NavBarContainer',
})`
  box-sizing: border-box;
  width: 100%;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
`;

export const NavBarContent = styled.div.attrs<DataAttributes>({
  'data-testid': 'NavBarContent',
})<BackgroundProps>`
  display: flex;
  justify-content: space-between;
  min-height: 46px;
  transition: background-color 0.35s ease-out;
  animation: nav-background-flash 0.45s ease-out;
  background: ${({ $background }) => getBoardNavVars($background)};
`;

export const NavColumn = styled.div.attrs<DataAttributes>({
  'data-testid': 'column-placeholder',
})`
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
`;

export const BoardHeaderContainer = styled(
  NavBarContainer,
).attrs<DataAttributes>({
  'data-testid': 'BoardHeaderContainer',
})<BackgroundProps>`
  ${navSolidBackgroundTransition}
  padding: 10px;
  z-index: 1;
  position: relative;
  background-color: ${({ $background }) => getBoardBarVars($background)};
`;

type BoardPageBackgroundProps = {
  $background?: string;
};

export const BoardPageBackground = styled.div.attrs<DataAttributes>({
  'data-testid': 'BoardPageBackground',
})<BoardPageBackgroundProps>`
  box-sizing: border-box;
  height: 100vh;
  width: 100%;
  background: transparent;
  position: relative;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding: ${fixedChromeOffset} 30px 30px;

  & > * {
    flex-shrink: 0;
  };

  background:${({ $background }) => getBoardGradientVars($background as BoardBackground)};
`;

export const BoardTitle = styled.button.attrs<DataAttributes>({
  'data-testid': 'BoardTitle',
})`
  color: inherit;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: inline-block;
  width: max-content;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  font-family: ${fontFamily};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const EditBoardTitleForm = styled.form`
  width: max-content;
  height: 40px;
  position: relative;
  top: -5px;
`;

export const EditBoardTitleInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'EditBoardTitleInput',
})` 
  font-family: ${fontFamily};
  font-weight: 500;
  font-size: 16px;
  border-radius: 0px;
  border: none;
  margin: 8px 0px 12px;
  padding: 10px;
`;
