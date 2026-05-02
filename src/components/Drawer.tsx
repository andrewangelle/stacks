import { useNavigate, useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { type CSSProperties, useState } from 'react';
import { IoIosArrowBack, IoIosArrowDropright } from 'react-icons/io';
import { RiTrelloFill } from 'react-icons/ri';
import { tokenState } from '~/store/atoms';
import { useGetBoardQuery, useGetBoardsQuery } from '~/store/boardsApi';
import {
  BoardsLinkContainer,
  BoardTitle,
  DrawerBoardEntry,
  DrawerContainer,
  DrawerHeader,
  DrawerHeaderTitle,
  YourBoardsTitle,
} from '~/styles/Board';
import {
  type BoardBackground,
  CreateBoardBackgroundChoice,
} from '~/styles/Boards';
import { FlexColumn } from '~/styles/Page';

export const sharedDrawerArrowStyles: CSSProperties = {
  cursor: 'pointer',
  position: 'absolute',
  top: '8px',
  color: 'white',
};

export function Drawer() {
  const params = useParams({ strict: false });
  const { data: board } = useGetBoardQuery(params.id);
  const [token] = useAtom(tokenState);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: boards } = useGetBoardsQuery(token?.user.id, {
    skip: !token?.user.id,
  });
  return (
    <>
      {!isDrawerOpen && (
        <IoIosArrowDropright
          style={{
            ...sharedDrawerArrowStyles,
            background: 'rgba(255, 255, 255, 0.16)',
            zIndex: 2,
          }}
          onClick={() => setDrawerOpen(true)}
          size={24}
        />
      )}
      <DrawerContainer isOpen={isDrawerOpen} background={board?.boardColor}>
        {isDrawerOpen && (
          <>
            <DrawerHeader>
              {token && (
                <DrawerHeaderTitle>
                  <div>{token?.user?.email}'s workspace</div>
                </DrawerHeaderTitle>
              )}
              <IoIosArrowBack
                style={{
                  ...sharedDrawerArrowStyles,
                  right: 0,
                }}
                onClick={() => setDrawerOpen(false)}
                size={24}
              />
            </DrawerHeader>

            <BoardsLinkContainer>
              <RiTrelloFill
                size={18}
                style={{ color: 'white', padding: '8px' }}
              />
              <YourBoardsTitle onClick={() => navigate({ to: '/boards' })}>
                Boards
              </YourBoardsTitle>
            </BoardsLinkContainer>

            <YourBoardsTitle>Your boards</YourBoardsTitle>

            <FlexColumn>
              {boards?.map((boardEntry) => {
                return (
                  <DrawerBoardEntry
                    key={boardEntry.id}
                    isSelected={boardEntry.id === board?.id}
                    onClick={() => navigate({ to: `/board/${boardEntry.id}` })}
                  >
                    <CreateBoardBackgroundChoice
                      background={boardEntry.boardColor as BoardBackground}
                    />
                    <BoardTitle>{boardEntry.boardTitle}</BoardTitle>
                  </DrawerBoardEntry>
                );
              })}
            </FlexColumn>
          </>
        )}
      </DrawerContainer>
    </>
  );
}
