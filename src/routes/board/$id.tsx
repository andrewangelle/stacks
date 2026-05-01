import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { AddLists, DragDropList, Drawer, ListCard, NavBar } from '~/components';
import {
  signedInState,
  tokenState,
  useGetBoardQuery,
  useGetListsQuery,
} from '~/store';
import { BoardPageBackground, Flex, Padding } from '~/styles';

function BoardPage() {
  const params = useParams({ strict: false });
  const { data: board } = useGetBoardQuery(params.id);
  const navigate = useNavigate();
  const [isSignedIn, setSignedIn] = useAtom(signedInState);
  const [token] = useAtom(tokenState);
  const { data: lists = [] } = useGetListsQuery(
    { boardId: params.id },
    { skip: !params.id },
  );

  useEffect(() => {
    if (!isSignedIn || !token?.access_token) {
      setSignedIn(false);
      navigate({ to: '/' });
    }
  }, [isSignedIn, navigate, token, setSignedIn]);
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
}

export const Route = createFileRoute('/board/$id')({
  component: BoardPage,
});
