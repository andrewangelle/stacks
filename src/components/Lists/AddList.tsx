import { useState } from 'react';
import * as boardStyles from '~/components/Boards/Board.css';
import * as listStyles from '~/components/Lists/List.css';
import { useCreateList } from '~/db/lists/lists.query';
import * as pageStyles from '~/styles/Page.css';
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
    <div
      className={boardStyles.addListContainer}
      data-testid="AddListContainer"
      data-editing={isEditing ? '' : undefined}
      ref={outsideClickRef}
    >
      {!isEditing && (
        <button
          type="button"
          className={listStyles.addListButton}
          data-testid="AddListButton"
          onClick={() => setEditing(true)}
        >
          + Add another list
        </button>
      )}

      {isEditing && (
        <>
          <input
            className={boardStyles.addListInput}
            data-testid="AddListInput"
            value={listName}
            onChange={(event) => setListName(event.target.value)}
          />

          <div
            className={pageStyles.flex}
            data-testid="Flex"
            style={{ margin: '0' }}
          >
            <button
              type="button"
              className={boardStyles.createListButton}
              data-testid="CreateListButton"
              onClick={onListCreate}
            >
              Add list
            </button>

            <button
              type="button"
              className={boardStyles.closeAddListButton}
              data-testid="CloseAddListButton"
              onClick={() => setEditing(false)}
            >
              X
            </button>
          </div>
        </>
      )}
    </div>
  );
}
