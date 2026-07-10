import { useState } from 'react';
import { DeleteList } from '~/components/Lists/DeleteList';
import { EditableListName } from '~/components/Lists/EditableListName';
import { ListHeaderCardCount } from '~/components/Lists/ListHeaderCardCount';
import { Flex } from '~/styles/Page.styled';

export function ListHeader({ id: listId }: { id: string }) {
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <EditableListName
        listId={listId}
        isEditingListName={isEditingListName}
        setIsEditingListName={setIsEditingListName}
        editedListTitle={editedListTitle}
        setEditedListTitle={setEditedListTitle}
      />

      <Flex data-testid="Flex" style={{ gap: '8px', alignItems: 'center' }}>
        <ListHeaderCardCount listId={listId} />
        {!isEditingListName && <DeleteList id={listId} />}
      </Flex>
    </div>
  );
}
