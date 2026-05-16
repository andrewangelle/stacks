import { useState } from 'react';
import { useCreateListMutation } from '~/store/listsApi';
import {
  AddListButton,
  AddListContainer,
  AddListInput,
  CloseAddListButton,
} from '~/styles/Board';
import { Flex } from '~/styles/Page';

type AddListsProps = {
  boardId: string;
};

export function AddLists({ boardId }: AddListsProps) {
  const [isEditing, setEditing] = useState(false);
  const [listName, setListName] = useState('');
  const [createList] = useCreateListMutation();

  function onListCreate() {
    createList({
      listTitle: listName,
      boardId,
    });
    setEditing(false);
  }

  return (
    <AddListContainer data-testid="AddListContainer" isEditing={isEditing}>
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
            data-testid="AddListInput"
            value={listName}
            onChange={(event) => setListName(event.target.value)}
          />
          <Flex data-testid="Flex" style={{ margin: '0' }}>
            <AddListButton data-testid="AddListButton" onClick={onListCreate}>
              Add list
            </AddListButton>
            <CloseAddListButton
              data-testid="CloseAddListButton"
              secondary
              onClick={() => setEditing(false)}
            >
              X
            </CloseAddListButton>
          </Flex>
        </>
      )}
    </AddListContainer>
  );
}
