import { useLocation } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import type { ComponentType, HTMLAttributes } from 'react';
import { RiTrelloFill } from 'react-icons/ri';
import { signedInState, tokenState } from '~/store/atoms';
import { blue, fontFamily } from '~/styles/Boards';
import { styled } from '~/styles/styled';

const NavBarContainer = styled('div')`
  font-family: ${fontFamily};
  width: 100vw;
  position: fixed;
  height: 40px;
  z-index: 1;
  background: ${(props: { background: string }) => props.background};
  display: flex;
  justify-content: space-around;
  color: white;
  position: fixed;
` as unknown as ComponentType<
  HTMLAttributes<HTMLDivElement> & { background: string }
>;

const LogOutText = styled('div')` 
  position: absolute;
  right: 15px;
  top: 25%;
  cursor: pointer;
`;

export function NavBar() {
  const [, setSignedIn] = useAtom(signedInState);
  const [, setToken] = useAtom(tokenState);
  const location = useLocation();

  const background =
    location.pathname === '/boards' || location.pathname === '/signin'
      ? blue
      : 'rgba(0,0,0,0.1)';

  return (
    <NavBarContainer background={background}>
      <div>
        <RiTrelloFill
          size={18}
          style={{ color: 'white', verticalAlign: '-webkit-baseline-middle' }}
        />
        <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
      </div>

      {location.pathname !== '/signin' && (
        <LogOutText
          onClick={() => {
            setSignedIn(false);
            setToken(null);
          }}
        >
          Log out
        </LogOutText>
      )}
    </NavBarContainer>
  );
}
