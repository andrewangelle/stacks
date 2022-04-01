import styled from 'styled-components';
import { blue, Button, fontFamily } from '.';

export const SignInButton = styled(Button)` 
  margin: 12px;
  padding: 8px 10px;
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
`