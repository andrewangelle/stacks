import { useState } from 'react';
import {
  AddListContainer,
  AddListInput,
  CloseAddListButton,
  CreateListButton,
} from '~/components/Boards/Board.styled';
import { AddListButton } from '~/components/Lists/List.styled';
import { useCreateList } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/hooks/useCurrentBoardId';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { Flex } from '~/styles/Page.styled';
import { onEnter } from '~/utils/keyboard';

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
            onKeyDown={onEnter(onListCreate)}
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
