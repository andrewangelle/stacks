import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { BoardPage } from '~/components/Boards/BoardPage';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { fetchUserId } from '~/middleware/auth';
import { boardByIdQueryOptions } from '~/query/boards';
import { listsQueryOptions } from '~/query/lists';

export const Route = createFileRoute('/board/$id')({
  wrapInSuspense: true,

  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  async loader({ context, params }) {
    if (!context.userId) {
      context.queryClient.clear();
      throw redirect({ to: '/auth/sign-in' });
    }
    await context.queryClient.ensureQueryData(boardByIdQueryOptions(params.id));
    await context.queryClient.ensureQueryData(listsQueryOptions(params.id));
  },

  pendingComponent() {
    return <BoardPageBackground data-testid="BoardPageBackground" />;
  },

  component() {
    return (
      <BoardPage>
        <Outlet />
      </BoardPage>
    );
  },
});
