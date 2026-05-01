import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { CreateBoard, NavBar } from '~/components';
import { signedInState, tokenState, useGetBoardsQuery } from '~/store';
import { BoardCardContainer, BoardsContainer, Padding } from '~/styles';

function BoardsPage() {
  const [isSignedIn, setSignedIn] = useAtom(signedInState);
  const [token] = useAtom(tokenState);
  const navigate = useNavigate();
  const userId = token?.user?.id;

  const { data: boards = [] } = useGetBoardsQuery(userId, { skip: !userId });

  useEffect(() => {
    if (!isSignedIn || !token?.access_token) {
      setSignedIn(false);
      navigate({ to: '/' });
    }
  }, [isSignedIn, navigate, token, setSignedIn]);

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
              background={board.boardColor}
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
}

export const Route = createFileRoute('/boards')({
  component: BoardsPage,
});
