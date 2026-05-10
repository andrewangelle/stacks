import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { authClient } from '~/auth/client';
import { CreateBoard } from '~/components/CreateBoard';
import { NavBar } from '~/components/NavBar';
import { useGetBoardsQuery } from '~/store/boardsApi';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardsContainer,
} from '~/styles/Boards';
import { Padding } from '~/styles/Page';

export const Route = createFileRoute('/boards')({
  component() {
    const { data: session, isPending } = authClient.useSession();
    const navigate = useNavigate();
    const userId = session?.user.id;

    const { data: boards = [] } = useGetBoardsQuery(userId, {
      skip: !userId,
    });

    if (isPending) {
      return null;
    }

    if (!session?.user || !userId) {
      return <Navigate to="/auth/$pathname" params={{ pathname: 'sign-in' }} />;
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
            <CreateBoard userId={userId} />
          </BoardsContainer>
        </Padding>
      </>
    );
  },
});
