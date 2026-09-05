import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { CardTitleDetailsContentIcons } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContentIcons';
import {
  EditCardSaveButton,
  EditCardTextareaContainer,
  EditCardTitleTextarea,
} from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { useUpdateCard } from '~/db/cards/cards.query';

type EditCardTitleProps = {
  id: string;
  listId: string;
  title: string;
  description: string;
  editedTitle: string;
  setEditedTitle: Dispatch<SetStateAction<string>>;
  handleEditOpenChange: (nextOpen: boolean) => void;
};

export function EditCardTitle({
  id,
  listId,
  title,
  description,
  editedTitle,
  setEditedTitle,
  handleEditOpenChange,
}: EditCardTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateCard = useUpdateCard();

  function handleSave() {
    if (editedTitle.trim() && editedTitle !== title) {
      updateCard({ cardId: id, listId, cardTitle: editedTitle.trim() });
    }
    handleEditOpenChange(false);
  }

  useEffect(() => {
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, []);

  return (
    <div ref={containerRef}>
      <EditCardTextareaContainer>
        <EditCardTitleTextarea
          ref={textareaRef}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
        />

        <CardTitleDetailsContentIcons
          cardId={id}
          description={description}
          isOpen={false}
          toggleOpen={() => null}
        />
      </EditCardTextareaContainer>

      <EditCardSaveButton
        onClick={(e) => {
          e.stopPropagation();
          handleSave();
        }}
      >
        Save
      </EditCardSaveButton>
    </div>
  );
}
