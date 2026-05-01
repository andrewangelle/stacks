import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { signedInState, type TokenType, tokenState } from '~/store/atoms';

function Index() {
  const [isSignedIn, setSignedIn] = useAtom(signedInState);
  const [, setToken] = useAtom(tokenState);
  const navigate = useNavigate();
  const { hash } = useLocation();

  const token = hash
    .split('&')
    .reduce((acc: Record<string, string>, string: string) => {
      const pairs = string.split('=');
      if (pairs[0] === '#access_token') {
        pairs[0] = pairs[0].split('#')[1];
      }
      acc[pairs[0]] = pairs[1];
      return acc;
    }, {}) as unknown as TokenType;

  useEffect(() => {
    if (token !== null && (token as TokenType).access_token && !isSignedIn) {
      setSignedIn(true);
      setToken(token);
      navigate({ to: '/boards' });
    }

    if (isSignedIn) {
      navigate({ to: '/boards' });
    }

    if (!isSignedIn) {
      navigate({ to: '/signin' });
    }
  }, [token, setSignedIn, setToken, isSignedIn, navigate]);

  return null;
}

export const Route = createFileRoute('/')({
  component: Index,
});
