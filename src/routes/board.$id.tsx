import { createFileRoute, redirect } from '@tanstack/react-router';
import { Drawer } from '~/components/Drawer';
import { AddLists } from '~/components/Lists/AddList';
import { DragDropList } from '~/components/Lists/DragDropList';
import { ListCard } from '~/components/Lists/ListCard';
import { NavBar } from '~/components/NavBar';
import { fetchUserId } from '~/middleware/auth';
import { useGetBoardQuery } from '~/query/boards';
import { useGetListsQuery } from '~/query/lists';
import { BoardPageBackground, Flex, Padding } from '~/styles/Page.styled';

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
          <Drawer />

          <Padding padding="50px 30px 30px">
            <Flex data-testid="Flex">
              {lists?.map((list) => (
                <DragDropList
                  key={list.id}
                  id={list.id}
                  listTitle={list.listTitle}
                >
                  <ListCard {...list} />
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
