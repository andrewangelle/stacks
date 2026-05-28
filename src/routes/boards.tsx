import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardCardSkeleton,
  BoardCardTitle,
  BoardsContainer,
} from '~/components/Boards/Boards.styled';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { NavBar } from '~/components/Nav/NavBar';
import { fetchUserId } from '~/middleware/auth';
import { useGetBoardsQuery } from '~/query/boards';
import { Padding } from '~/styles/Page.styled';

export const Route = createFileRoute('/boards')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },
  loader({ context }) {
    if (!context.userId) {
      throw redirect({ to: '/auth/sign-in' });
    }
    return { userId: context.userId };
  },
  component() {
    const { isLoading, data: boards = [], isSuccess } = useGetBoardsQuery();
    const navigate = useNavigate();
    return (
      <>
        <NavBar />
        <Padding padding="50px 30px 30px">
          <BoardsContainer data-testid="BoardsContainer">
            {isLoading &&
              (['one', 'two', 'three'] as const).map((id) => (
                <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
              ))}

            {isSuccess &&
              boards.map((board) => (
                <BoardCardContainer
                  data-testid="BoardCardContainer"
                  key={board.id}
                  background={board.boardColor as BoardBackground}
                  onClick={() => navigate({ to: `/board/${board.id}` })}
                >
                  <BoardCardTitle data-testid="BoardCardTitle">
                    {board.boardTitle}
                  </BoardCardTitle>
                </BoardCardContainer>
              ))}
            {!isLoading && <CreateBoard />}
          </BoardsContainer>
        </Padding>
      </>
    );
  },
});
