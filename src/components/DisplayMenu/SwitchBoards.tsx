import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { Dialog } from 'radix-ui';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { Board } from '~/components/Boards/Board';
import {
  SwitchBoardsContent,
  SwitchBoardsEmpty,
  SwitchBoardsGrid,
  SwitchBoardsOverlay,
  SwitchBoardsSearchClear,
  SwitchBoardsSearchField,
  SwitchBoardsSearchInput,
  SwitchBoardsTitle,
  SwitchBoardsTrigger,
} from '~/components/DisplayMenu/SwitchBoards.styled';
import { SwitchBoardsIcon } from '~/components/DisplayMenu/SwitchBoardsIcon';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useIsMobile } from '~/utils/useIsMobile';
import { usePrevious } from '~/utils/usePrevious';

export function SwitchBoards() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const currentBoardId = useCurrentBoardId();
  const { data: boards } = useSuspenseQuery(boardsQueryOptions);
  const router = useRouterState();
  const previousLoad = usePrevious(isLoading);
  const isMobile = useIsMobile();

  const query = search.trim().toLowerCase();
  const matchingBoards = boards
    .filter((board) => board.id !== currentBoardId)
    .filter((board) => board.boardTitle.toLowerCase().includes(query));

  function onOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setSearch('');
  }

  function clearSearch() {
    setSearch('');
    searchInput.current?.focus();
  }

  useEffect(() => {
    setIsLoading(router.isLoading);
  }, [router.isLoading]);

  useEffect(() => {
    if (previousLoad && !isLoading) {
      setOpen(false);
    }
  }, [previousLoad, isLoading]);

  return (
    <Dialog.Root
      data-testid="SwitchBoardsRoot"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Tooltip content="Switch Boards">
        <SwitchBoardsTrigger>
          <SwitchBoardsIcon />
          Switch boards
        </SwitchBoardsTrigger>
      </Tooltip>

      <Dialog.Portal data-testid="SwitchBoardsPortal">
        <SwitchBoardsOverlay>
          <SwitchBoardsContent
            $isMobile={isMobile}
            aria-describedby={undefined}
          >
            <SwitchBoardsTitle>Switch boards</SwitchBoardsTitle>

            <SwitchBoardsSearchField $isMobile={isMobile}>
              <FiSearch />
              <SwitchBoardsSearchInput
                ref={searchInput}
                value={search}
                placeholder="Search your boards"
                aria-label="Search your boards"
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <SwitchBoardsSearchClear
                  aria-label="Clear search"
                  onClick={clearSearch}
                >
                  <RxCross2 />
                </SwitchBoardsSearchClear>
              )}
            </SwitchBoardsSearchField>

            {matchingBoards.length ? (
              <SwitchBoardsGrid>
                {matchingBoards.map((board) => (
                  <Board key={board.id} boardId={board.id} />
                ))}
              </SwitchBoardsGrid>
            ) : (
              <SwitchBoardsEmpty>
                {query
                  ? `No boards match "${search.trim()}".`
                  : 'You have no other boards.'}
              </SwitchBoardsEmpty>
            )}
          </SwitchBoardsContent>
        </SwitchBoardsOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
