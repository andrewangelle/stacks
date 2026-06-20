import { RiTrelloFill } from 'react-icons/ri';
import { LogoLink } from '~/styles/Page.styled';

export function Logo() {
  return (
    <LogoLink to="/boards" data-testid="LogoLink">
      <RiTrelloFill
        size={18}
        style={{
          color: 'white',
          verticalAlign: '-webkit-baseline-middle',
          transform: 'scale(-1, -1)',
        }}
      />
      <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
    </LogoLink>
  );
}
