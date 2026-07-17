import { styled } from '@pigment-css/react';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { blue, focusRingBlue } from '~/styles/tokens';

export const ComboboxWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const ComboboxLabel = styled.label`
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
  padding: 0 10px 6px;
`;

export const ComboboxTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 10px 10px;
  padding: 0 4px 0 8px;
  border: 1px solid rgba(9, 30, 66, 0.8);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(9, 30, 66, 0.02);
  }

  &:focus-within {
    border: 1px solid ${focusRingBlue}; 
  }
`;

export const ComboboxInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 0;
  font-family: ${fontFamily};
  font-size: 14px;
  color: rgba(9, 30, 66, .95);
  cursor: pointer;

  &::placeholder {
    color: rgba(9, 30, 66, .95); 
  }
`;

export const ComboboxIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: rgba(9, 30, 66, .75);
  border-radius: 4px;

  &:hover {
    background: rgb(244, 245, 247);
  }
`;

export const ComboboxMenu = styled.ul`
  position: absolute;
  top: 75px;
  list-style: none;
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: -6px 10px 10px;
  padding: 4px 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1001;
`;

export const ComboboxItem = styled.li`
  position: relative;
  padding: 10px 14px;
  font-family: ${fontFamily};
  font-size: 14px;
  color: rgba(9, 30, 66, .9);
  cursor: pointer;
  user-select: none;

  &[data-highlighted='true'] {
    background: rgb(244, 245, 247);
  }

  &[data-selected='true'] {
    background: #E9F2FF;
    color: ${blue};
    box-shadow: inset 3px 0 0 ${blue};
  }
`;

export const ComboboxItemCurrent = styled.div`
  font-size: 13px;
  color: ${blue};
`;
