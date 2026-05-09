import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { CreateBoard } from '~/components/CreateBoard';
import { NavBar } from '~/components/NavBar';
import { signedInState, tokenState } from '~/store/atoms';
import { useGetBoardsQuery } from '~/store/boardsApi';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardsContainer,
} from '~/styles/Boards';
import { Padding } from '~/styles/Page';

export const Route = createFileRoute('/boards')({
  component() {
    const [isSignedIn, setSignedIn] = useAtom(signedInState);
    const [token, setToken] = useAtom(tokenState);
    const navigate = useNavigate();
    const userId = token?.user?.id;

    const { data: boards = [] } = useGetBoardsQuery(userId, { skip: !userId });

    useEffect(() => {
      if (!token?.access_token || !userId) {
        if (token) {
          setToken(null);
        }
        if (isSignedIn) {
          setSignedIn(false);
        }
        navigate({ to: '/signin' });
        return;
      }

      if (!isSignedIn) {
        setSignedIn(true);
      }
    }, [isSignedIn, navigate, token, setSignedIn, setToken, userId]);

    if (!userId) {
      return null;
    }

    return (
      <>
        <NavBar />
        <Padding padding="50px 30px 30px">
          <BoardsContainer>
            {boards.map((board) => (
              <BoardCardContainer
                key={board.id}
                background={board.boardColor as BoardBackground}
                onClick={() => navigate({ to: `/board/${board.id}` })}
              >
                {board.boardTitle}
              </BoardCardContainer>
            ))}
            <CreateBoard />
          </BoardsContainer>
        </Padding>
      </>
    );
  },
});
