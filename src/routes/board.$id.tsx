import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { AddLists } from '~/components/AddList';
import { DragDropList } from '~/components/DragDropList';
import { Drawer } from '~/components/Drawer';
import { ListCard } from '~/components/ListCard';
import { NavBar } from '~/components/NavBar';
import { signedInState, tokenState } from '~/store/atoms';
import { useGetBoardQuery } from '~/store/boardsApi';
import { useGetListsQuery } from '~/store/listsApi';
import { BoardPageBackground, Flex, Padding } from '~/styles/Page';

export const Route = createFileRoute('/board/$id')({
  component() {
    const params = useParams({ strict: false });
    const { data: board } = useGetBoardQuery(params.id);
    const navigate = useNavigate();
    const [isSignedIn, setSignedIn] = useAtom(signedInState);
    const [token, setToken] = useAtom(tokenState);
    const { data: lists = [] } = useGetListsQuery(
      { boardId: params.id },
      { skip: !params.id },
    );

    useEffect(() => {
      if (token?.access_token && !token?.user?.id) {
        setSignedIn(false);
        setToken(null);
        navigate({ to: '/signin' });
        return;
      }

      if (!token?.access_token) {
        if (isSignedIn) {
          setSignedIn(false);
        }
        navigate({ to: '/' });
        return;
      }

      if (!isSignedIn) {
        setSignedIn(true);
      }
    }, [isSignedIn, navigate, token, setSignedIn, setToken]);

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
