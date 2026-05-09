import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { signedInState, tokenState } from '~/store/atoms';
import { useTokenFromHash } from '~/utils/session';

export const Route = createFileRoute('/')({
  component() {
    const [isSignedIn, setSignedIn] = useAtom(signedInState);
    const [storedToken, setToken] = useAtom(tokenState);
    const navigate = useNavigate();
    const hashToken = useTokenFromHash();

    // Returning from an external auth provider redirect (#access_token=...)
    useEffect(() => {
      if (hashToken?.access_token) {
        setSignedIn(true);
        setToken(hashToken);
        navigate({ to: '/boards' });
      }
    }, [hashToken, setSignedIn, setToken, navigate]);

    useEffect(() => {
      if (storedToken?.access_token && storedToken.user?.id) {
        if (!isSignedIn) {
          setSignedIn(true);
        }
        navigate({ to: '/boards' });
        return;
      }

      if (isSignedIn) {
        setSignedIn(false);
      }
      navigate({ to: '/signin' });
    }, [storedToken, isSignedIn, setSignedIn, navigate]);

    return null;
  },
});
