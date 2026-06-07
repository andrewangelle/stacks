import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  ChecklistTitle,
  EditChecklistTitleForm,
  EditChecklistTitleInput,
} from '~/components/Checklists/Checklists.styled';
import { useGetChecklist, useUpdateChecklist } from '~/query/checklists';
import { Flex } from '~/styles/Page.styled';
import { useOutsideClick } from '~/utils/useOutsideClick';

type ChecklistEditableTitleProps = {
  id: string;
};

export function ChecklistEditableTitle({ id }: ChecklistEditableTitleProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const [editedTitle, setEditedTitle] = useState('');
  const updateChecklist = useUpdateChecklist();
  const outsideClickRef = useOutsideClick(
    onOutsideTitleEditClick,
    isEditingTitle,
  );

  function openEditTitle() {
    setEditingTitle(true);
    setEditedTitle(checklist?.checklistTitle ?? '');
  }

  function onOutsideTitleEditClick() {
    setEditingTitle(false);

    if (editedTitle !== checklist?.checklistTitle) {
      updateChecklist({
        checklistId: id,
        checklistTitle: editedTitle,
        cardId: checklist?.cardId ?? '',
      });
    }
  }

  return (
    <Flex data-testid="Flex" style={{ alignItems: 'center' }}>
      <Bs.BsCheck2Square size={24} />

      {!isEditingTitle && (
        <ChecklistTitle data-testid="ChecklistTitle" onClick={openEditTitle}>
          {checklist?.checklistTitle}
        </ChecklistTitle>
      )}

      {isEditingTitle && (
        <EditChecklistTitleForm ref={outsideClickRef}>
          <EditChecklistTitleInput
            data-testid="EditCardTitleInput"
            value={editedTitle}
            autoFocus
            onChange={(event) =>
              setEditedTitle((_prevState) => event.target.value)
            }
          />
        </EditChecklistTitleForm>
      )}
    </Flex>
  );
}
