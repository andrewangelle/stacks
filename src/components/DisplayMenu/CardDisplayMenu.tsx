import type { RefObject } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  CardDisplayMenuContainer,
  DisplayMenuToggleButton,
  DisplayMenuToggleLabel,
} from '~/components/DisplayMenu/DisplayMenu.styled';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import {
  useCommentsVisible,
  useSetCommentsVisible,
} from '~/db/user/user.query';

type CardDisplayMenuProps = {
  hidden: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
};

export function CardDisplayMenu({ hidden, menuRef }: CardDisplayMenuProps) {
  const commentsVisible = useCommentsVisible();
  const setCommentsVisible = useSetCommentsVisible();
  const selected = !commentsVisible;

  return (
    <CardDisplayMenuContainer ref={menuRef} $isMobile={false} $hidden={hidden}>
      <Tooltip content={selected ? 'Show comments' : 'Hide comments'}>
        <DisplayMenuToggleButton
          $selected={selected}
          aria-pressed={selected}
          onClick={() =>
            setCommentsVisible({ commentsVisible: !commentsVisible })
          }
        >
          <BiCommentDetail size={16} />
          <DisplayMenuToggleLabel $selected={selected}>
            Comments
          </DisplayMenuToggleLabel>
        </DisplayMenuToggleButton>
      </Tooltip>
    </CardDisplayMenuContainer>
  );
}
