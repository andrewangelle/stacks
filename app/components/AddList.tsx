import { useState } from "react";
import { useRecoilState } from "recoil";

import { AddListContainer, AddListInput, Flex, AddListButton, CloseAddListButton } from "~/styles";

import { tokenState, useCreateListMutation } from "~/store";

export function AddLists({boardId}: {boardId: string}){
  const [token] = useRecoilState(tokenState)
  const [isEditing, setEditing] = useState(false);
  const [listName, setListName] = useState('');
  const [createList] = useCreateListMutation();

  function onListCreate(){
    createList({
      listTitle: listName,
      boardId,
      token: token?.access_token!,
      userId: (token as any).user.id
    });
    setEditing(false)
  }

  return (
    <AddListContainer isEditing={isEditing}>
      {!isEditing && (
        <div onClick={() => setEditing(true)}>
          + Add a list
        </div>
      )}
      {isEditing && (
        <>
          <AddListInput
            value={listName} 
            onChange={(event) => setListName(event.target.value)} 
          />
          <Flex style={{margin: "0"}}>
            <AddListButton
              onClick={onListCreate}
            >
              Add list
            </AddListButton>
            <CloseAddListButton secondary onClick={() => setEditing(false)}>
              X
            </CloseAddListButton>
          </Flex>
        </>
      )}
    </AddListContainer>
  )
}