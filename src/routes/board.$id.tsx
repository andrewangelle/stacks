import type { List as ListType } from '@prisma/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Draggable } from '~/components/Draggable';
import { AddLists } from '~/components/Lists/AddList';
import { List } from '~/components/Lists/List';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { fetchUserId } from '~/middleware/auth';
import { boardByIdQueryOptions } from '~/query/boards';
import { listsQueryOptions, reorderLists } from '~/query/lists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

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
    const boardId = useCurrentBoardId();
    const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
    const { data: lists = [] } = useSuspenseQuery(listsQueryOptions(boardId));

    return (
      <BoardPageBackground
        data-testid="BoardPageBackground"
        background={board?.boardColor}
      >
        {lists?.map((list) => (
          <Draggable
            key={list.id}
            id={list.id}
            name={list.listTitle}
            type="list"
            onDrop={(item: ListType) => reorderLists(item, boardId, list.id)}
          >
            <List id={list.id} />
          </Draggable>
        ))}
        {boardId && <AddLists boardId={boardId} />}
      </BoardPageBackground>
    );
  },
});
