import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { guestUserIdState, signedInState, tokenState } from '~/store/atoms';
import {
  createGuestToken,
  createGuestUserId,
  useTokenFromHash,
} from '~/utils/session';

export const Route = createFileRoute('/')({
  component() {
    const [isSignedIn, setSignedIn] = useAtom(signedInState);
    const [storedToken, setToken] = useAtom(tokenState);
    const [guestUserId, setGuestUserId] = useAtom(guestUserIdState);
    const navigate = useNavigate();
    const hashToken = useTokenFromHash();

    // Not signed in
    useEffect(() => {
      if (!isSignedIn) {
        setSignedIn(true);
        const userId = guestUserId ?? createGuestUserId();
        setGuestUserId(userId);
        setToken(createGuestToken(userId));
        navigate({ to: '/boards' });
      }
    }, [isSignedIn, setSignedIn, setToken, navigate, guestUserId]);

    // Is redirected from auth provider
    useEffect(() => {
      if (hashToken?.access_token) {
        setSignedIn(true);
        setToken(hashToken);
        navigate({ to: '/boards' });
      }
    }, [hashToken, setSignedIn, setToken, navigate]);

    // Is signed in
    useEffect(() => {
      if (storedToken?.access_token) {
        if (!isSignedIn) {
          setSignedIn(true);
        }
        navigate({ to: '/boards' });
      }
    }, [storedToken, isSignedIn, setSignedIn, navigate]);

    return null;
  },
});
