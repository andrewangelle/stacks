import { useUser } from '@clerk/tanstack-react-start';
import { useNavigate } from '@tanstack/react-router';
import { type CSSProperties, useState } from 'react';
import * as Io from 'react-icons/io';
import * as Ri from 'react-icons/ri';
import { useGetBoardQuery, useGetBoardsQuery } from '~/query/boards';
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
  const { user } = useUser();
  const { data: board } = useGetBoardQuery();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: boards } = useGetBoardsQuery();
  const userName = user?.firstName ?? user?.primaryEmailAddress?.emailAddress;
  const workspaceName = userName ? `${userName}'s workspace` : 'Your workspace';
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
      <DrawerContainer
        data-testid="DrawerContainer"
        isOpen={isDrawerOpen}
        background={board?.boardColor}
      >
        {isDrawerOpen && (
          <>
            <DrawerHeader data-testid="DrawerHeader">
              {user && (
                <DrawerHeaderTitle data-testid="DrawerHeaderTitle">
                  <div>{workspaceName}</div>
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

            <BoardsLinkContainer
              data-testid="BoardsLinkContainer"
              onClick={() => navigate({ to: '/boards' })}
            >
              <Ri.RiTrelloFill
                size={18}
                style={{
                  color: 'white',
                  padding: '8px',
                  transform: 'scale(-1, -1)',
                }}
              />
              <YourBoardsTitle data-testid="YourBoardsTitle">
                Boards
              </YourBoardsTitle>
            </BoardsLinkContainer>

            <YourBoardsTitle data-testid="YourBoardsTitle">
              Your boards
            </YourBoardsTitle>

            <FlexColumn data-testid="FlexColumn">
              {boards?.map((boardEntry) => {
                return (
                  <DrawerBoardEntry
                    data-testid="DrawerBoardEntry"
                    key={boardEntry.id}
                    isSelected={boardEntry.id === board?.id}
                    onClick={() => navigate({ to: `/board/${boardEntry.id}` })}
                  >
                    <CreateBoardBackgroundChoice
                      data-testid="CreateBoardBackgroundChoice"
                      background={boardEntry.boardColor as BoardBackground}
                    />
                    <BoardTitle data-testid="BoardTitle">
                      {boardEntry.boardTitle}
                    </BoardTitle>
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
