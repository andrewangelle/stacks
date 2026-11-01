import { useMatches, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { BoardIcon } from '~/components/DisplayMenu/BoardIcon';
import {
  DisplayMenuBoardButton,
  DisplayMenuBoardLabel,
  DisplayMenuContainer,
  DisplayMenuSeperator,
} from '~/components/DisplayMenu/DisplayMenu.styled';
import { SwitchBoards } from '~/components/DisplayMenu/SwitchBoards/SwitchBoards';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useIsMobile } from '~/hooks/useIsMobile';

export function DisplayMenu() {
  const isMobile = useIsMobile();
  const isCardModalOpen = useIsCardModalOpen();
  const { menuRef, isArrivingFromCardPage } = useArrivalFromCardPage(isMobile);
  const hidden = !isMobile && (isCardModalOpen || isArrivingFromCardPage);

  return (
    <DisplayMenuContainer ref={menuRef} $isMobile={isMobile} $hidden={hidden}>
      <Tooltip content="Board">
        <DisplayMenuBoardButton aria-current="page">
          <BoardIcon />
          <DisplayMenuBoardLabel>Board</DisplayMenuBoardLabel>
        </DisplayMenuBoardButton>
      </Tooltip>

      <DisplayMenuSeperator />

      <SwitchBoards />
    </DisplayMenuContainer>
  );
}

function useIsCardModalOpen() {
  return useMatches({
    select: (matches) =>
      matches.some((match) => match.routeId === '/board/$id/card/$cardId'),
  });
}

/**
 * Closing a desktop `/card/$cardId` mounts a fresh board menu, and a fresh
 * mount never transitions. Mount it hidden, let the browser compute that
 * style, then reveal it so it slides up like it does when a modal closes.
 * Reloads and direct loads have no previous `/card/` location, so they paint
 * visible straight away.
 */
function useArrivalFromCardPage(isMobile: boolean) {
  const menuRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRouterState({
    select: (state) => state.resolvedLocation?.pathname,
  });
  const [isArrivingFromCardPage, setIsArrivingFromCardPage] = useState(
    () => !isMobile && Boolean(previousPathname?.startsWith('/card/')),
  );

  useEffect(() => {
    if (!isArrivingFromCardPage) {
      return;
    }

    menuRef.current?.getBoundingClientRect();
    setIsArrivingFromCardPage(false);
  }, [isArrivingFromCardPage]);

  return { menuRef, isArrivingFromCardPage };
}
