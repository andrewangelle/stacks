import { styled } from '@pigment-css/react';
import { Tooltip } from 'radix-ui';

export const TooltipContent = styled(Tooltip.Content)({
  color: 'white',
  backgroundColor: 'black',
  borderRadius: '4px',
  padding: '6px',
  fontSize: '12px',
  textAlign: 'center',
  textShadow: '0 1px 0 rgba(0,0,0,0.5)',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
});
