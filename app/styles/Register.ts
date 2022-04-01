import styled from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';

import { fontFamily, blue } from '~/styles';

export const RegisterModalRoot = styled(Dialog.Root).attrs({'data-testid': 'RegisterModalRoot'})`
  width: inherit;
  display: inherit;
`;

export const RegisterModalPortal = styled(Dialog.Portal).attrs({'data-testid': 'RegisterModalPortal'})`
  width: inherit;
  display: inherit;
`;

export const RegisterModalOverlay = styled(Dialog.Overlay).attrs({'data-testid': 'RegisterModalOverlay'})` 
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 2;
`;

export const RegisterModalContent = styled(Dialog.Content).attrs({'data-testid': 'RegisterModalContent'})` 
  position: relative;
  font-family: ${fontFamily};
  min-width: 700px;
  min-height: 500px;
  max-height: 700px;
  height: 100vh;
  overflow: scroll;
  background: white;
  border: 2px solid ${blue};
  padding: 30;
  border-radius: 5px;
`;

export const RegisterModalTrigger = styled(Dialog.Trigger).attrs({'data-testid': 'RegisterModalTrigger'})` 
  border: none;
  padding: none;
  cursor: pointer;
  width: 100%;
`;

export const RegisterModalClose = styled(Dialog.Close)` 
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  cursor: pointer;
`

export const RegisterModalTitle = styled(Dialog.Title)` 
  margin: 0 16px;
  font-size: 18px;
`;