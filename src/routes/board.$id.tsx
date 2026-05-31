import type { List as ListType } from '@prisma/client';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Draggable } from '~/components/Draggable';
import { AddLists } from '~/components/Lists/AddList';
import { List } from '~/components/Lists/List';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { NavBar } from '~/components/Nav/NavBar';
import { fetchUserId } from '~/middleware/auth';
import { useGetBoard } from '~/query/boards';
import { reorderLists, useGetLists } from '~/query/lists';
import { Flex, Padding } from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export const Route = createFileRoute('/board/$id')({
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
    const { data: board } = useGetBoard();
    const { data: lists = [] } = useGetLists();
    const boardId = useCurrentBoardId();

    return (
      <>
        <NavBar />
        <BoardPageBackground
          data-testid="BoardPageBackground"
          background={board?.boardColor}
        >
          <Padding padding="50px 30px 30px">
            <Flex data-testid="Flex">
              {lists?.map((list) => (
                <Draggable
                  key={list.id}
                  id={list.id}
                  name={list.listTitle}
                  type="list"
                  onDrop={(item: ListType) =>
                    reorderLists(item, boardId, list.id)
                  }
                >
                  <List id={list.id} />
                </Draggable>
              ))}
              {board?.id && <AddLists boardId={board?.id} />}
            </Flex>
          </Padding>
        </BoardPageBackground>
      </>
    );
  },
});
