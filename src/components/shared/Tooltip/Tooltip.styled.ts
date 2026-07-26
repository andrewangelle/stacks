import { Tooltip } from 'radix-ui';
import { styled } from 'styled-components';

export const TooltipContent = styled(Tooltip.Content)`
  position: relative;
  color: white;
  background-color: black;
  border-radius: 4px;
  padding: 6px;
  font-size: 12px;
  text-align: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1002;
`;
