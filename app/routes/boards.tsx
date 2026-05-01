import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { CreateBoard, NavBar } from '~/components';
import { signedInState, tokenState, useGetBoardsQuery } from '~/store';
import { BoardCardContainer, BoardsContainer, Padding } from '~/styles';

export default function BoardsPage() {
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [token] = useRecoilState(tokenState);
  const navigate = useNavigate();
  const userId = token?.user?.id;

  const { data: boards = [] } = useGetBoardsQuery(userId, { skip: !userId });

  useEffect(() => {
    if (!isSignedIn || !token?.access_token) {
      setSignedIn(false);
      navigate('/');
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
              onClick={() => navigate(`/board/${board.id}`)}
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
