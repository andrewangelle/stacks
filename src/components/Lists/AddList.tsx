import { useState } from 'react';
import {
  AddListButton,
  AddListContainer,
  AddListInput,
  CloseAddListButton,
} from '~/components/Boards/Board.styled';
import { useCreateList } from '~/query/lists';
import { Flex } from '~/styles/Page.styled';
import { useOutsideClick } from '~/utils/useOutsideClick';

type AddListsProps = {
  boardId: string;
};

export function AddLists({ boardId }: AddListsProps) {
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
      data-testid="AddListContainer"
      data-editing={isEditing ? '' : undefined}
      ref={outsideClickRef}
    >
      {!isEditing && (
        <button
          type="button"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 14,
            color: 'white',
            letterSpacing: '0.05rem',
          }}
          onClick={() => setEditing(true)}
        >
          + Add another list
        </button>
      )}

      {isEditing && (
        <>
          <AddListInput
            data-testid="AddListInput"
            value={listName}
            autoFocus
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
