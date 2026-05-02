import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { NavBar } from '~/components/NavBar';
import { RegisterModal } from '~/components/RegisterModal';
import { signedInState, tokenState } from '~/store/atoms';
import { Center, Flex, FlexColumn, Padding } from '~/styles/Page';
import {
  CloseError,
  ErrorMessageContainer,
  InputLabel,
  SignInButton,
} from '~/styles/SignIn';

export const Route = createFileRoute('/signin')({
  component() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignedIn, setSignedIn] = useAtom(signedInState);
    const [token, setToken] = useAtom(tokenState);
    const [hasError, setError] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

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
        return;
      }

      if (isSignedIn && pathname !== '/boards') {
        navigate({ to: '/boards' });
      }
    }, [token, setSignedIn, isSignedIn, navigate, pathname]);

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
  },
});
