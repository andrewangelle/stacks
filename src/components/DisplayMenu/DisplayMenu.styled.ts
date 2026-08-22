import { css, type DataAttributes, styled } from 'styled-components';
import { blue, fontFamily } from '~/styles/tokens';

export const displayMenuItemStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: none;
  font-family: ${fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #172b4d;
  cursor: pointer;

  svg {
    flex: 0 0 16px;
  }
`;

export const DisplayMenuContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuContainer',
})`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: flex;
  align-items: stretch;
  gap: 4px;
  background-color: #fff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
  font-family: ${fontFamily};
  color: black;
  font-weight: 500;
  font-size: 14px;
`;

export const DisplayMenuBoardButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuBoardButton',
  type: 'button',
})`
  ${displayMenuItemStyles}
  background: #e9f2fe;
  color: ${blue};
  cursor: not-allowed;

  &:hover {
    background: #cfe1fd;
  }
`;

export const DisplayMenuBoardLabel = styled.span.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuBoardLabel',
})`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 18px;
    height: 3px;
    border-radius: 2px;
    background: ${blue};
  }
`;

export const DisplayMenuSeperator = styled.div.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuSeperator',
})`
  width: 1px;
  margin: 6px 4px;
  background-color: rgba(9, 30, 66, .14);
  flex: 0 0 1px;
  align-self: stretch;
  display: block;
  height: auto;
`;
