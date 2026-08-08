import { useState } from 'react';
import {
  AddListContainer,
  AddListInput,
  CloseAddListButton,
  CreateListButton,
} from '~/components/Boards/Board.styled';
import { AddListButton } from '~/components/Lists/List.styled';
import { useCreateList } from '~/db/lists/lists.query';
import { Flex } from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function AddLists() {
  const boardId = useCurrentBoardId();
  const [isEditing, setEditing] = useState(false);
  const [listName, setListName] = useState('');
  const createList = useCreateList();
  const outsideClickRef = useOutsideClick(onOutsideListCreateClick, isEditing);

  function onOutsideListCreateClick() {
    setEditing(false);
    setListName('');
  }

  function onListCreate() {
    createList({
      listTitle: listName,
      boardId,
    });
    setEditing(false);
    setListName('');
  }

  return (
    <AddListContainer
      data-editing={isEditing ? '' : undefined}
      ref={outsideClickRef}
    >
      {!isEditing && (
        <AddListButton onClick={() => setEditing(true)}>
          + Add another list
        </AddListButton>
      )}

      {isEditing && (
        <>
          <AddListInput
            value={listName}
            autoFocus
            onChange={(event) => setListName(event.target.value)}
          />

          <Flex style={{ margin: '0' }}>
            <CreateListButton onClick={onListCreate}>Add list</CreateListButton>

            <CloseAddListButton $secondary onClick={() => setEditing(false)}>
              X
            </CloseAddListButton>
          </Flex>
        </>
      )}
    </AddListContainer>
  );
}
