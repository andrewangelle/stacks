import { useState } from 'react';
import { EditListNameInput, ListName } from '~/components/Lists/List.styled';
import { useGetListById, useUpdateList } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

type EditableListNameProps = {
  listId: string;
};

export function EditableListName({ listId }: EditableListNameProps) {
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
          data-testid="ListName"
          style={{
            margin: '8px 0px 12px 8px',
          }}
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
          data-testid="EditListNameInput"
          value={editedListTitle}
          autoFocus
          onChange={(event) =>
            setEditedListTitle((_prevState) => event.target.value)
          }
          onBlur={onOutsideNameEditClick}
        />
      )}
    </div>
  );
}
