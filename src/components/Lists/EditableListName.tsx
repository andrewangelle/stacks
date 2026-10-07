import { useState } from 'react';
import { EditListNameInput, ListName } from '~/components/Lists/List.styled';
import { useGetListById, useUpdateList } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/hooks/useCurrentBoardId';
import { useListId } from '~/hooks/useListId';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { onEnter } from '~/utils/keyboard';

export function EditableListName() {
  const listId = useListId();
  const { data: list } = useGetListById({ id: listId });
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState('');
  const boardId = useCurrentBoardId();
  const updateList = useUpdateList();
  const outsideClickRef = useOutsideClick(
    onOutsideNameEditClick,
    isEditingListName,
  );

  function onOutsideNameEditClick() {
    setIsEditingListName(false);

    if (editedListTitle !== list?.listTitle) {
      updateList({
        listId,
        boardId,
        listTitle: editedListTitle,
      });
    }
  }

  return (
    <div data-testid="EditableListName">
      {!isEditingListName && (
        <ListName
          onClick={() => {
            setIsEditingListName(true);
            setEditedListTitle(list?.listTitle ?? '');
          }}
        >
          {list?.listTitle}
        </ListName>
      )}

      {isEditingListName && (
        <EditListNameInput
          ref={outsideClickRef}
          value={editedListTitle}
          autoFocus
          onChange={(event) =>
            setEditedListTitle((_prevState) => event.target.value)
          }
          onBlur={onOutsideNameEditClick}
          onKeyDown={onEnter((input) => input.blur())}
        />
      )}
    </div>
  );
}
