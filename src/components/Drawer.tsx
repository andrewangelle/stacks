import { useNavigate, useParams } from '@tanstack/react-router';
import { type CSSProperties, useState } from 'react';
import * as Io from 'react-icons/io';
import * as Ri from 'react-icons/ri';
import { authClient } from '~/auth/client';
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
  const session = authClient.useSession();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: boards } = useGetBoardsQuery();
  return (
    <>
      {!isDrawerOpen && (
        <Io.IoIosArrowDropright
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
              {session.data?.user && (
                <DrawerHeaderTitle>
                  <div>{session.data.user.email}&apos;s workspace</div>
                </DrawerHeaderTitle>
              )}
              <Io.IoIosArrowBack
                style={{
                  ...sharedDrawerArrowStyles,
                  right: 0,
                }}
                onClick={() => setDrawerOpen(false)}
                size={24}
              />
            </DrawerHeader>

            <BoardsLinkContainer>
              <Ri.RiTrelloFill
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
