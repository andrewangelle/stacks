import { useLocation, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { signedInState, type TokenType, tokenState } from '~/store';

export default function Index() {
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [, setToken] = useRecoilState(tokenState);
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
      navigate('/boards');
    }

    if (isSignedIn) {
      navigate('/boards');
    }

    if (!isSignedIn) {
      navigate('/signin');
    }
  }, [token, setSignedIn, setToken, isSignedIn, navigate]);

  return null;
}
