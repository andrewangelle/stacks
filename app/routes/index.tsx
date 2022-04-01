import { useEffect } from 'react';
import { useNavigate, useLocation } from 'remix';
import { useRecoilState } from 'recoil';

import { signedInState, tokenState, TokenType } from '~/store';
import { SignIn } from '~/components';
  
export default function Index() {
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate();
  const { hash } = useLocation();

  const token = hash.split('&').reduce((acc, string) => {
    let [key, value] = string.split('=')
    if(key === '#access_token'){
      key = key.split('#')[1]
    }
    return {
      ...acc,
      [key]: value
    }
  }, {}) as TokenType

  useEffect(() => {
    if(token !== null && (token as TokenType).access_token && !isSignedIn){
      setSignedIn(true);
      setToken(token)
      navigate('/boards')
    }

    if(isSignedIn) {
      navigate('/boards')
    }
  }, [token, setSignedIn, setToken, isSignedIn, navigate])

  return (
    <SignIn />
  )

}
