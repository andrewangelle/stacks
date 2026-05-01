import { useAtom } from 'jotai';
import { useState } from 'react';
import { tokenState } from '~/store/atoms';
import { useCreateListMutation } from '~/store/listsApi';
import {
  AddListButton,
  AddListContainer,
  AddListInput,
  CloseAddListButton,
} from '~/styles/Board';
import { Flex } from '~/styles/Page';

export function AddLists({ boardId }: { boardId: string }) {
  const [token] = useAtom(tokenState);
  const [isEditing, setEditing] = useState(false);
  const [listName, setListName] = useState('');
  const [createList] = useCreateListMutation();

  function onListCreate() {
    createList({
      listTitle: listName,
      boardId,
      token: token?.access_token ?? '',
      userId: token?.user.id ?? '',
    });
    setEditing(false);
  }

  return (
    <AddListContainer isEditing={isEditing}>
      {!isEditing && (
        <button
          type="button"
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => setEditing(true)}
        >
          + Add a list
        </button>
      )}
      {isEditing && (
        <>
          <AddListInput
            value={listName}
            onChange={(event) => setListName(event.target.value)}
          />
          <Flex style={{ margin: '0' }}>
            <AddListButton onClick={onListCreate}>Add list</AddListButton>
            <CloseAddListButton secondary onClick={() => setEditing(false)}>
              X
            </CloseAddListButton>
          </Flex>
        </>
      )}
    </AddListContainer>
  );
}
