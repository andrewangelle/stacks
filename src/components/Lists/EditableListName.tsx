import type { Dispatch, SetStateAction } from 'react';
import { AddCardInput, ListName } from '~/components/Lists/List.styled';
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
    <div>
      {!isEditingListName && (
        <ListName
          data-testid="ListName"
          onClick={() => {
            setIsEditingListName(true);
            setEditedListTitle(list?.listTitle ?? '');
          }}
        >
          {list?.listTitle}
        </ListName>
      )}

      {isEditingListName && (
        <AddCardInput
          ref={outsideClickRef}
          data-testid="AddCardInput"
          value={editedListTitle}
          autoFocus
          onChange={(event) =>
            setEditedListTitle((_prevState) => event.target.value)
          }
        />
      )}
    </div>
  );
}
