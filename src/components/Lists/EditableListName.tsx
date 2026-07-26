import { useState } from 'react';
import * as styles from '~/components/Lists/List.css';
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
        // biome-ignore lint/a11y/useSemanticElements: <style conflict>
        <div
          role="button"
          tabIndex={0}
          className={styles.listName}
          data-testid="ListName"
          style={{
            margin: '8px 0px 12px 8px',
          }}
          onClick={() => {
            setIsEditingListName(true);
            setEditedListTitle(list?.listTitle ?? '');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsEditingListName(true);
              setEditedListTitle(list?.listTitle ?? '');
            }
          }}
        >
          {list?.listTitle}
        </div>
      )}

      {isEditingListName && (
        <input
          className={styles.editListNameInput}
          ref={outsideClickRef}
          data-testid="EditListNameInput"
          value={editedListTitle}
          onChange={(event) =>
            setEditedListTitle((_prevState) => event.target.value)
          }
          onBlur={onOutsideNameEditClick}
        />
      )}
    </div>
  );
}
