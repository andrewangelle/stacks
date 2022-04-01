import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'remix';

import {RegisterModal} from '~/components'
import { Center, Padding, FlexColumn, Flex, SignInButton, InputLabel } from '~/styles';

import { signedInState, tokenState } from '~/store';
import { NavBar } from './NavBar';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [token, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate();  

  async function signIn(){
    const res = await fetch('/resources/signin', {
      body: JSON.stringify({
        email: username,
        password: password
      }),
      method: 'POST',
    })

    const result = await res.json()

    if(result.user.role === 'authenticated'){
      setSignedIn(true)
      setToken(result.session)
      navigate('/boards')
    }
  }

  useEffect(() => {
    if(token && token.access_token && !isSignedIn){
      setSignedIn(true);
      setToken(token)
      navigate('/boards')
    }

    if(isSignedIn) {
      navigate('/boards')
    }
  }, [token, setSignedIn, setToken, isSignedIn, navigate])


  return (
    <>
      <NavBar />
      <Padding padding='30px'>
        <Center>
          <FlexColumn>
            <InputLabel htmlFor='username'>Email</InputLabel>
            <input 
              name='username' 
              value={username}  
              onChange={event => setUsername(event.target.value)}
            />
          </FlexColumn>
          <FlexColumn>
            <InputLabel htmlFor='username'>Password</InputLabel>
            <input 
              name='password' 
              value={password}  
              onChange={event => setPassword(event.target.value)}
            />
          </FlexColumn>
          <Flex>
            <SignInButton onClick={signIn}>Sign in</SignInButton>
            <RegisterModal />
          </Flex>
        </Center>
      </Padding>
    </>
  )

}
