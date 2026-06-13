import type { Dispatch, SetStateAction } from 'react';
import { EditListNameInput, ListName } from '~/components/Lists/List.styled';
import { useGetListById, useUpdateList } from '~/query/lists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

type EditableListNameProps = {
  listId: string;
  editedListTitle: string;
  isEditingListName: boolean;
  setIsEditingListName: (isEditingListName: boolean) => void;
  setEditedListTitle: Dispatch<SetStateAction<string>>;
};

export function EditableListName({
  isEditingListName,
  setIsEditingListName,
  editedListTitle,
  setEditedListTitle,
  listId,
}: EditableListNameProps) {
  const { data: list } = useGetListById({ id: listId });
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
