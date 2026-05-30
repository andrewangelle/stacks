import { useState } from 'react';
import { CardModal } from '~/components/Cards/CardModal';
import { DragDropCard } from '~/components/Cards/DragDropCard';
import { AddNewCard } from '~/components/Lists/AddNewCard';
import { DeleteList } from '~/components/Lists/DeleteList';
import { EditableListName } from '~/components/Lists/EditableListName';
import {
  ListCardSkeleton,
  ListContainer,
} from '~/components/Lists/List.styled';
import { useGetCardsByListId } from '~/query/cards';
import { useGetListById } from '~/query/lists';

export function List({ id: listId }: { id: string }) {
  const { isLoading } = useGetListById({ id: listId });
  const { data: cards } = useGetCardsByListId({
    listId,
  });
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState('');

  if (isLoading) {
    return (
      <ListContainer data-testid="ListContainer" key={listId}>
        <ListCardSkeleton />
      </ListContainer>
    );
  }

  return (
    <ListContainer data-testid="ListContainer" key={listId}>
      <EditableListName
        listId={listId}
        isEditingListName={isEditingListName}
        setIsEditingListName={setIsEditingListName}
        editedListTitle={editedListTitle}
        setEditedListTitle={setEditedListTitle}
      />

      {!isEditingListName && <DeleteList id={listId} />}

      {cards?.map((card) => (
        <DragDropCard key={card.id} id={card.id}>
          <CardModal id={card.id} />
        </DragDropCard>
      ))}

      <AddNewCard listId={listId} />
    </ListContainer>
  );
}
