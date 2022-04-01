import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {  useNavigate, useParams } from "remix"

import { 
  AddLists, 
  ListCard, 
  DragDropList, 
  Drawer,
  NavBar
} from "~/components";
import { 
  BoardPageBackground, 
  Flex, 
  Padding, 
} from "~/styles";

import { 
  useGetListsQuery,
  useGetBoardQuery,
  signedInState,
  tokenState,
} from "~/store";

export default function BoardPage(){
  const params = useParams();
  const { data: board } = useGetBoardQuery(params.id);
  const navigate = useNavigate();
  const [isSignedIn, setSignedIn] = useRecoilState(signedInState);
  const [token] = useRecoilState(tokenState);
  const { data: lists = [] } = useGetListsQuery(
    { boardId: params.id},
    { skip: !params.id }
  )

  useEffect(() => {
    if(!isSignedIn || !(token!.access_token)){
      setSignedIn(false)
      navigate('/')
    }
  }, [isSignedIn, navigate, token, setSignedIn]);
  return (
    <>
      <NavBar />

      <BoardPageBackground background={board?.boardColor}>
        <Drawer />

        <Padding padding='50px 30px 30px'>
          <Flex>
            {lists?.map(list => (
              <DragDropList 
                key={list.id} 
                id={list.id} 
                listTitle={list.listTitle} 
              >
                <ListCard  {...list} />
              </DragDropList>
            ))}
            {board?.id && <AddLists boardId={board?.id} />}
          </Flex>
        </Padding>
      </BoardPageBackground>
    </>
  )
}