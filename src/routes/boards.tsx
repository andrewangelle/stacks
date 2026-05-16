import { useUser } from '@clerk/tanstack-react-start';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { CreateBoard } from '~/components/CreateBoard';
import { NavBar } from '~/components/NavBar';
import { fetchUserId } from '~/middleware/auth';
import { useGetBoardsQuery } from '~/query/boards';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardsContainer,
} from '~/styles/Boards';
import { Padding } from '~/styles/Page';

export const Route = createFileRoute('/boards')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },
  loader({ context }) {
    if (!context.userId) {
      throw redirect({ to: '/auth/sign-in' });
    }
  },
  component() {
    const { user } = useUser();
    const { data: boards = [] } = useGetBoardsQuery();
    const navigate = useNavigate();
    return (
      <>
        <NavBar />
        <Padding padding="50px 30px 30px">
          <BoardsContainer data-testid="BoardsContainer">
            {boards.map((board) => (
              <BoardCardContainer
                data-testid="BoardCardContainer"
                key={board.id}
                background={board.boardColor as BoardBackground}
                onClick={() => navigate({ to: `/board/${board.id}` })}
              >
                {board.boardTitle}
              </BoardCardContainer>
            ))}
            <CreateBoard userId={user?.id ?? ''} />
          </BoardsContainer>
        </Padding>
      </>
    );
  },
});
