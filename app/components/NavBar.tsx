import { useLocation, useNavigate } from 'remix';
import styled from 'styled-components';
import { RiTrelloFill } from "react-icons/ri";
import { useRecoilState } from 'recoil';

import { blue, fontFamily } from '~/styles';

import { signedInState, tokenState } from '~/store';
import { useEffect } from 'react';

const NavBarContainer = styled.div<{background: string;}>` 
  font-family: ${fontFamily};
  width: 100vw;
  position: fixed;
  height: 40px;
  z-index: 1;
  background: ${props => props.background};
  display: flex;
  justify-content: space-around;
  color: white;
  position: fixed;
`;

const LogOutText = styled.div` 
  position: absolute;
  right: 15px;
  top: 25%;
  cursor: pointer;
`;

export function NavBar(){
  const [, setSignedIn] = useRecoilState(signedInState);
  const [, setToken] = useRecoilState(tokenState);
  const location = useLocation();
  
  const background = location.pathname === '/boards' ? blue : 'rgba(0,0,0,0.1)';

  return (
    <NavBarContainer background={background}>
      <div>
        <RiTrelloFill size={18} style={{color: 'white', verticalAlign: '-webkit-baseline-middle'}}></RiTrelloFill>
        <span style={{verticalAlign: 'bottom'}}>stacks - a trello clone</span>
      </div>
      
      <LogOutText 
        onClick={() => {
          setSignedIn(false);
          setToken(null)
        }}
      >
        Log out
      </LogOutText>
    </NavBarContainer>
  )
}