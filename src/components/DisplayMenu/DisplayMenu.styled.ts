import { css, type DataAttributes, styled } from 'styled-components';
import { displayMenuSlideUpFrames } from '~/styles/animations';
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

export const displayMenuItemHoverStyles = css`
  &:hover {
    background: rgba(9, 30, 66, 0.06);
  }
`;

export const displayMenuSelectedItemStyles = css`
  background: #e9f2fe;
  color: ${blue};

  &:hover {
    background: #cfe1fd;
  }
`;

export const displayMenuSelectedLabelStyles = css`
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

/** Card menu height (6 + 36 + 6) + its 24px bottom offset + a 12px gap. */
export const cardDisplayMenuReservedSpace = '84px';

type DisplayMenuContainerProps = {
  $isMobile: boolean;
  $hidden: boolean;
};
export const DisplayMenuContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuContainer',
})<DisplayMenuContainerProps>`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%)
    translateY(${({ $hidden }) => ($hidden ? 'calc(100% + 24px)' : '0')});
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  transition:
    transform 150ms ease-out,
    visibility 150ms ease-out;
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
  width: ${({ $isMobile }) => ($isMobile ? '65%' : 'auto')};

  ${({ $isMobile }) => {
    if ($isMobile) {
      return 'justify-content: center';
    }
    return '';
  }}
`;

export const DisplayMenuBoardButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuBoardButton',
  type: 'button',
})`
  ${displayMenuItemStyles}
  ${displayMenuSelectedItemStyles}
  cursor: not-allowed;
`;

export const DisplayMenuBoardLabel = styled.span.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuBoardLabel',
})`
  ${displayMenuSelectedLabelStyles}
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

export const CardDisplayMenuContainer = styled(
  DisplayMenuContainer,
).attrs<DataAttributes>({
  'data-testid': 'CardDisplayMenuContainer',
})`
  pointer-events: auto;
  animation: ${displayMenuSlideUpFrames} 150ms ease-out;
`;

type SelectedProps = {
  $selected: boolean;
};
export const DisplayMenuToggleButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuToggleButton',
  type: 'button',
})<SelectedProps>`
  ${displayMenuItemStyles}
  ${({ $selected }) =>
    $selected ? displayMenuSelectedItemStyles : displayMenuItemHoverStyles}
`;

export const DisplayMenuToggleLabel = styled.span.attrs<DataAttributes>({
  'data-testid': 'DisplayMenuToggleLabel',
})<SelectedProps>`
  ${({ $selected }) => ($selected ? displayMenuSelectedLabelStyles : '')}
`;
