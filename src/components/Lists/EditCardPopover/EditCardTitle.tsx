import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { CardTitleDetailsContentIcons } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContentIcons';
import {
  EditCardSaveButton,
  EditCardTextareaContainer,
  EditCardTitleContainer,
  EditCardTitleTextarea,
} from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { useUpdateCard } from '~/db/cards/cards.query';
import {
  useGetCardTitleDetailsChecklists,
  useSetCardChecklistExpanded,
} from '~/db/checklists/checklists.query';
import { useIsMobile } from '~/utils/useIsMobile';

export type EditCardTitleProps = {
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
  const { mutate: setChecklistExpanded } = useSetCardChecklistExpanded();
  const { data } = useGetCardTitleDetailsChecklists({
    cardId: id,
  });
  const isMobile = useIsMobile();

  const isOpen = data?.isChecklistsExpanded ?? false;

  function toggleOpen(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setChecklistExpanded({ cardId: id, isChecklistsExpanded: !isOpen });
  }

  function handleSave() {
    if (editedTitle.trim() && editedTitle !== title) {
      updateCard({ cardId: id, listId, cardTitle: editedTitle.trim() });
    }
    handleEditOpenChange(false);
  }

  useEffect(() => {
    if (!isMobile) {
      textareaRef.current?.select();
    }
  }, [isMobile]);

  return (
    <EditCardTitleContainer ref={containerRef}>
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
          isOpen={isOpen}
          toggleOpen={toggleOpen}
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
    </EditCardTitleContainer>
  );
}
