import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'remix';

import { signedInState, tokenState } from '~/store';
import { 
  Button, 
  Center, 
  FlexColumn, 
  InputLabel, 
  RegisterModalClose, 
  RegisterModalContent, 
  RegisterModalOverlay, 
  RegisterModalPortal, 
  RegisterModalRoot, 
  RegisterModalTrigger 
} from '~/styles';

export function RegisterModal(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [, setSignedIn] = useRecoilState(signedInState);
  const [, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate(); 
  const [isSubmitted, setSubmitted] = useState(false); 
  
  async function register(){
    const res = await fetch('/resources/register', {
      body: JSON.stringify({
        email: username,
        password: password,
        firstName,
        lastName
      }),
      method: 'POST',
    })

    const result = await res.json();

    if(result.user.role === 'authenticated'){
      setSignedIn(true)
      setToken(result.session)
      navigate('/boards')
    }

   }

  return (
    <RegisterModalRoot>
      <RegisterModalTrigger style={{border: 'none', background: 'transparent'}}>
        <Button secondary style={{padding: '8px 10px'}}>Register</Button>
      </RegisterModalTrigger>

      <RegisterModalPortal>
        <RegisterModalOverlay>
          <RegisterModalContent>
            <RegisterModalClose>X</RegisterModalClose>
            <Center>
              {isSubmitted && (
                <>Check your email for a confirmation link</> 
              )}
              {!isSubmitted && (
                <>
                  <FlexColumn>
                    <InputLabel htmlFor='email'>Email</InputLabel>
                    <input 
                      name='email' 
                      value={username}  
                      onChange={event => setUsername(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='firstName'>First Name</InputLabel>
                    <input 
                      name='firstName' 
                      value={firstName}  
                      onChange={event => setFirstName(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                    <input 
                      name='lastName' 
                      value={lastName}  
                      onChange={event => setLastName(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <input 
                      name='password'
                      value={password}  
                      onChange={event => setPassword(event.target.value)}
                    />
                  </FlexColumn>
                  <Button onClick={() => register().then(() =>    setSubmitted(true))} style={{padding: '8px 10px'}}>Register</Button>
                </>
              )}
            </Center>

          </RegisterModalContent>
        </RegisterModalOverlay>
      </RegisterModalPortal>
    </RegisterModalRoot>
  )
}