import { createFileRoute, redirect } from '@tanstack/react-router';
import { AddLists } from '~/components/Lists/AddList';
import { DragDropList } from '~/components/Lists/DragDropList';
import { List } from '~/components/Lists/List';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { NavBar } from '~/components/Nav/NavBar';
import { fetchUserId } from '~/middleware/auth';
import { useGetBoardQuery } from '~/query/boards';
import { useGetListsQuery } from '~/query/lists';
import { Flex, Padding } from '~/styles/Page.styled';

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
    const { data: board } = useGetBoardQuery();
    const { data: lists = [] } = useGetListsQuery();

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
                <DragDropList
                  key={list.id}
                  id={list.id}
                  listTitle={list.listTitle}
                >
                  <List id={list.id} />
                </DragDropList>
              ))}
              {board?.id && <AddLists boardId={board?.id} />}
            </Flex>
          </Padding>
        </BoardPageBackground>
      </>
    );
  },
});
