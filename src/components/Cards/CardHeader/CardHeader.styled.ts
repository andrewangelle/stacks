import { styled } from '@pigment-css/react';
import { Dialog } from 'radix-ui';

export const CardHeaderContainer = styled.div` 
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0,0,0, 0.2);
`;

export const CardModalClose = styled(Dialog.Close)` 
  border: none;
  right: 0;
  padding: 8px 12px;
  cursor: pointer;
  background: white;
  border-radius: 100%;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const CardModalCloseSpinnerSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  margin: 4px;
`;
