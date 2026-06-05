import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  type BoardBackground,
  BoardCardContainer,
  BoardCardSkeleton,
  BoardCardTitle,
  BoardsContainer,
} from '~/components/Boards/Boards.styled';
import { CreateBoard } from '~/components/Boards/CreateBoard';
import { fetchUserId } from '~/middleware/auth';
import { boardsQueryOptions } from '~/query/boards';

export const Route = createFileRoute('/boards')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },
  async loader({ context }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }

    await context.queryClient.ensureQueryData(boardsQueryOptions);
    return { userId: context.userId };
  },
  pendingComponent() {
    return (
      <BoardsContainer data-testid="BoardsContainer">
        {(['one', 'two', 'three'] as const).map((id) => (
          <BoardCardSkeleton data-testid="BoardCardSkeleton" key={id} />
        ))}
      </BoardsContainer>
    );
  },
  component() {
    const { data: boards = [] } = useSuspenseQuery(boardsQueryOptions);
    const navigate = useNavigate();
    return (
      <BoardsContainer data-testid="BoardsContainer">
        {boards.map((board) => (
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

        <CreateBoard />
      </BoardsContainer>
    );
  },
});
