import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { authStateFn } from '~/auth/middleware';
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
  async beforeLoad() {
    const { userId, firstName } = await authStateFn();
    return { userId, firstName };
  },
  loader({ context }) {
    if (!context.userId) {
      throw redirect({ to: '/auth/sign-in' });
    }
    return { userId: context.userId, firstName: context.firstName };
  },
  component() {
    const { userId } = Route.useLoaderData();
    const { data: boards = [] } = useGetBoardsQuery();
    const navigate = useNavigate();
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
