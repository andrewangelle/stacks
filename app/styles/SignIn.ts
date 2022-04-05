import { TiDelete } from 'react-icons/ti';
import styled from 'styled-components';
import { blue, Button, fontFamily, red } from '.';

export const SignInButton = styled(Button)` 
  margin: 12px;
  padding: 8px 10px;
  border: 1px solid ${blue};
`

export const RegisterButton = styled(Button)` 
  margin: 12px;
  padding: 8px 10px;
  background: #fff;
  color: ${blue};
  border: 1px solid ${blue};
`

export const InputLabel = styled.label` 
  font-family: ${fontFamily};
  width: 250px;
`;

export const ErrorMessageContainer = styled.div` 
  position: relative;
  width: 100%;
  background: ${red};
  color: white;
  font-family: ${fontFamily};
  height: 25px;
  font-size: 12px;
  border-radius: 5px;
  white-space: nowrap;
`;

export const CloseError = styled(TiDelete)` 
  position: absolute;
  right: 5px;
  top: 25%;
  cursor: pointer;
`