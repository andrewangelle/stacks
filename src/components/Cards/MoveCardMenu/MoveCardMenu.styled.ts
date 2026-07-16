import { styled } from '@pigment-css/react';
import { Popover, Select } from 'radix-ui';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { animationStyles } from '~/styles/animations';
import { Button } from '~/styles/Page.styled';
import { blue, focusRingBlue } from '~/styles/tokens';

export const SelectSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '40px',
  borderRadius: '8px',
  margin: '0px 8px 8px',
  ...animationStyles.pulse,
});

export const MoveCardMenuTrigger = styled(Popover.Trigger)` 
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: rgb(221, 222, 225);
  border-radius: 4px;
  padding: 4px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgb(183, 185, 190)
  }
`;

export const MoveCardMenuContent = styled(Popover.Content)` 
  width: 350px;
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
`;

export const MoveCardMenuHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(9, 30, 66, .75);
`;

export const DropdownLabel = styled.div` 
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
  padding: 10px;
`;

export const MoveCardButton = styled(Button)` 
  padding: 10px 20px;
  align-self: flex-start;
  margin: 8px;
  font-weight: 500;
  width: stretch;
`;

export const SelectTrigger = styled(Select.Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 10px 10px;
  padding: 8px;
  border: 2px solid rgba(9, 30, 66, .2);
  border-radius: 8px;
  background: #fff;
  font-family: ${fontFamily};
  font-size: 14px;
  color: rgba(9, 30, 66, .95);
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: rgba(9, 30, 66, .35);
  }

  &:focus,
  &[data-state='open'] {
    border-color: ${focusRingBlue};
  }
`;

export const SelectContent = styled(Select.Content)`
  z-index: 1001;
  box-sizing: border-box;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  border-radius: 8px;
  background: #fff;
  font-family: ${fontFamily};
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
  overflow: hidden;
`;

export const SelectViewport = styled(Select.Viewport)`
  padding: 4px 0;
`;

export const SelectLabel = styled(Select.Label)`
  padding: 12px 14px 6px;
  font-family: ${fontFamily};
  font-size: 14px;
  font-weight: 700;
  color: rgba(9, 30, 66, .9);
`;

export const SelectItem = styled(Select.Item)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  font-size: 14px;
  color: rgba(9, 30, 66, .9);
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background: rgb(244, 245, 247);
  }

  &[data-state='checked'],
  &[data-state='checked'][data-highlighted] {
    background: #E9F2FF;
    color: ${blue};
    box-shadow: inset 3px 0 0 ${blue};
  }

  &:hover {
    background: rgb(221, 222, 225);
    box-shadow: inset 3px 0 0 ${blue};
  }
`;

export const SelectItemCurrent = styled.span`
  font-size: 13px;
  color: ${blue};
`;

export const MoveCardSelectRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const MoveCardListColumn = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

export const MoveCardPositionColumn = styled.div`
  flex: 0 0 132px;
`;
