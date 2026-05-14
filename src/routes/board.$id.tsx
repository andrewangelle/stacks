import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { authStateFn } from '~/auth/middleware';
import { AddLists } from '~/components/AddList';
import { DragDropList } from '~/components/DragDropList';
import { Drawer } from '~/components/Drawer';
import { ListCard } from '~/components/ListCard';
import { NavBar } from '~/components/NavBar';
import { useGetBoardQuery } from '~/store/boardsApi';
import { useGetListsQuery } from '~/store/listsApi';
import { BoardPageBackground, Flex, Padding } from '~/styles/Page';

export const Route = createFileRoute('/board/$id')({
  async beforeLoad() {
    const { userId } = await authStateFn();
    return { userId };
  },
  loader({ context }) {
    if (!context.userId) {
      throw redirect({ to: '/auth/sign-in' });
    }
  },
  component() {
    const params = useParams({ strict: false });
    const { data: board } = useGetBoardQuery(params.id);
    const { data: lists = [] } = useGetListsQuery(
      { boardId: params.id },
      { skip: !params.id },
    );

    return (
      <>
        <NavBar />

        <BoardPageBackground background={board?.boardColor}>
          <Drawer />

          <Padding padding="50px 30px 30px">
            <Flex>
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
