import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { signedInState, type TokenType, tokenState } from '~/store/atoms';

function Index() {
  const [isSignedIn, setSignedIn] = useAtom(signedInState);
  const [, setToken] = useAtom(tokenState);
  const navigate = useNavigate();
  const { hash } = useLocation();

  const token = useMemo(() => {
    if (!hash) {
      return null;
    }

    return hash
      .split('&')
      .reduce((acc: Record<string, string>, string: string) => {
        const pairs = string.split('=');
        if (pairs[0] === '#access_token') {
          pairs[0] = pairs[0].split('#')[1];
        }
        acc[pairs[0]] = pairs[1];
        return acc;
      }, {}) as unknown as TokenType;
  }, [hash]);

  useEffect(() => {
    if (token?.access_token && !isSignedIn) {
      setSignedIn(true);
      setToken(token);
      navigate({ to: '/boards' });
      return;
    }

    if (isSignedIn) {
      navigate({ to: '/boards' });
      return;
    }

    navigate({ to: '/signin' });
  }, [token, setSignedIn, setToken, isSignedIn, navigate]);

  return null;
}

export const Route = createFileRoute('/')({
  component: Index,
});
