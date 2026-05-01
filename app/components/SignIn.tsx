import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { RegisterModal } from '~/components';
import { signedInState, tokenState } from '~/store';
import {
  Center,
  CloseError,
  ErrorMessageContainer,
  Flex,
  FlexColumn,
  InputLabel,
  Padding,
  SignInButton,
} from '~/styles';
import { NavBar } from './NavBar';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [token, setToken] = useRecoilState(tokenState);
  const [hasError, setError] = useState(false);
  const navigate = useNavigate();

  console.log(hasError);
  async function signIn() {
    try {
      const res = await fetch('/resources/signin', {
        body: JSON.stringify({
          email: username,
          password: password,
        }),
        method: 'POST',
      });

      const result = await res.json();

      if (result.user.role === 'authenticated') {
        setSignedIn(true);
        setToken(result.session);
        navigate({ to: '/boards' });
      }
    } catch (_e) {
      setError(true);
    }
  }

  useEffect(() => {
    if (token?.access_token && !isSignedIn) {
      setSignedIn(true);
      setToken(token);
      navigate({ to: '/boards' });
    }

    if (isSignedIn) {
      navigate({ to: '/boards' });
    }
  }, [token, setSignedIn, setToken, isSignedIn, navigate]);

  return (
    <>
      <NavBar />
      <Padding padding="30px">
        <Center>
          <FlexColumn>
            <InputLabel htmlFor="username">Email</InputLabel>
            <input
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </FlexColumn>

          <FlexColumn>
            <InputLabel htmlFor="username">Password</InputLabel>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FlexColumn>

          {hasError && (
            <FlexColumn>
              <ErrorMessageContainer>
                <Center>Check your login info.</Center>
                <CloseError onClick={() => setError(false)} />
              </ErrorMessageContainer>
            </FlexColumn>
          )}

          <Flex>
            <SignInButton onClick={signIn}>Sign in</SignInButton>
            <RegisterModal />
          </Flex>
        </Center>
      </Padding>
    </>
  );
}
