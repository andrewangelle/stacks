import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { useNavigate } from 'remix';

import { CreateBoard, NavBar } from '~/components';
import { BoardCard, BoardsContainer, Padding } from '~/styles';

import { signedInState, tokenState, useGetBoardsQuery } from '~/store';

export default function BoardsPage() {
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [token] = useRecoilState(tokenState)
  const navigate = useNavigate();
  const userId = token?.user.id;

  const { data: boards = [] } = useGetBoardsQuery(
    userId,
    {skip: !userId}
  );

  console.log(token)

  useEffect(() => {
    if(!isSignedIn || !(token?.access_token)){
      setSignedIn(false)
      navigate('/')
    }
  }, [isSignedIn, navigate, token, setSignedIn])

  if(!userId){
    return null
  }

  return (
    <>
      <NavBar />
      <Padding padding="50px 30px 30px" >
        <BoardsContainer>
          {boards.map(board => (
            <BoardCard
              key={board.id} 
              background={board.boardColor}
              onClick={() => navigate(`/board/${board.id}`)}
            >
              {board.boardTitle}
            </BoardCard>
          ))}
          <CreateBoard />
        </BoardsContainer>
      </Padding>
    </>
  );
}
