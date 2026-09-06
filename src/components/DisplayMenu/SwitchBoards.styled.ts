import { Dialog } from 'radix-ui';
import { css, type DataAttributes, styled } from 'styled-components';
import { displayMenuItemStyles } from '~/components/DisplayMenu/DisplayMenu.styled';
import { blue, fontFamily } from '~/styles/tokens';

const overlay = css`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 2;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  inset: 0;
`;

export const SwitchBoardsOverlay = styled(Dialog.Overlay).attrs<DataAttributes>(
  {
    'data-testid': 'SwitchBoardsOverlay',
  },
)`
  ${overlay}
  position: fixed;
`;

export const SwitchBoardsLoadingOverlay = styled.div.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsLoadingOverlay',
})`
  ${overlay}
  position: absolute;
`;

export const SwitchBoardsTrigger = styled(Dialog.Trigger).attrs<DataAttributes>(
  {
    'data-testid': 'SwitchBoardsTrigger',
  },
)`
  ${displayMenuItemStyles}

  &:hover {
    background: rgba(9, 30, 66, 0.06);
  }
`;

type IsMobileProps = {
  $isMobile: boolean;
};

export const SwitchBoardsContent = styled(Dialog.Content).attrs<DataAttributes>(
  {
    'data-testid': 'SwitchBoardsContent',
  },
)<IsMobileProps>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #FFF;
  height: 75%;
  width: 50%;
  min-width: 320px;
  padding: ${({ $isMobile }) => ($isMobile ? '24px 0px' : '24px')};
  border-radius: 8px;
  font-family: ${fontFamily};
  overflow-y: auto;
`;

export const SwitchBoardsTitle = styled(Dialog.Title).attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsTitle',
})`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  white-space: nowrap;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
`;

export const SwitchBoardsSearchField = styled.div.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsSearchField',
})<IsMobileProps>`
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  color: rgba(9, 30, 66, 0.7);
  ${({ $isMobile }) => ($isMobile ? 'margin: 0px 24px;' : '')}
  > svg {
    position: absolute;
    left: 12px;
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
`;

export const SwitchBoardsSearchInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsSearchInput',
})`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 40px;
  border: 1px solid rgba(9, 30, 66, 0.25);
  border-radius: 4px;
  background: #FFF;
  font-family: ${fontFamily};
  font-size: 16px;
  line-height: 20px;
  color: #172b4d;
  outline: none;

  &::placeholder {
    color: rgba(9, 30, 66, 0.6);
  }

  &:focus {
    border-color: ${blue};
    box-shadow: inset 0 0 0 1px ${blue};
  }
`;

export const SwitchBoardsSearchClear = styled.button.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsSearchClear',
  type: 'button',
})`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: none;
  color: #172b4d;
  cursor: pointer;

  > svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: rgba(9, 30, 66, 0.08);
  }
`;

export const SwitchBoardsGrid = styled.div.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsGrid',
})<IsMobileProps>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? 'repeat(auto-fill, 100%)' : 'repeat(auto-fill, 145px)')};
  gap: 12px;
  align-content: start;

  a[data-testid='BoardCardContainer'] {
    box-sizing: border-box;
    margin: 0;
    width: 100%;
    min-width: 0;
    max-width: none;
    height: 96px;
  }
`;

export const SwitchBoardsEmpty = styled.p.attrs<DataAttributes>({
  'data-testid': 'SwitchBoardsEmpty',
})<IsMobileProps>`
  margin: ${({ $isMobile }) => ($isMobile ? '0px 24px' : '0')}; 
  font-size: 14px;
  color: rgba(9, 30, 66, 0.7);
`;
