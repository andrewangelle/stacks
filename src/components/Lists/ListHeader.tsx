import { useState } from 'react';
import { DeleteList } from '~/components/Lists/DeleteList';
import { EditableListName } from '~/components/Lists/EditableListName';

export function ListHeader({ id: listId }: { id: string }) {
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <EditableListName
        listId={listId}
        isEditingListName={isEditingListName}
        setIsEditingListName={setIsEditingListName}
        editedListTitle={editedListTitle}
        setEditedListTitle={setEditedListTitle}
      />

      {!isEditingListName && <DeleteList id={listId} />}
    </div>
  );
}
