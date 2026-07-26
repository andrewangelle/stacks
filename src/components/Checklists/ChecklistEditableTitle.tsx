import { Dialog } from 'radix-ui';
import { useState } from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import {
  useGetChecklist,
  useUpdateChecklist,
} from '~/db/checklists/checklists.query';
import * as pageStyles from '~/styles/Page.css';
import { useOutsideClick } from '~/utils/useOutsideClick';

type ChecklistEditableTitleProps = {
  id: string;
};

export function ChecklistEditableTitle({ id }: ChecklistEditableTitleProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const [editedTitle, setEditedTitle] = useState('');
  const { mutate: updateChecklist } = useUpdateChecklist();
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
    <div
      className={pageStyles.flex}
      data-testid="Flex"
      style={{ alignItems: 'center', minWidth: 0, flex: '1 1 auto' }}
    >
      <BsCheck2Square size={24} style={{ flexShrink: 0 }} />

      {!isEditingTitle && (
        <Dialog.Title
          className={checklistsStyles.checklistTitle}
          data-testid="ChecklistTitle"
          onClick={openEditTitle}
        >
          {checklist?.checklistTitle}
        </Dialog.Title>
      )}

      {isEditingTitle && (
        <form className={cardStyles.editCardTitleForm} ref={outsideClickRef}>
          <input
            className={checklistsStyles.editChecklistTitleInput}
            data-testid="EditCardTitleInput"
            value={editedTitle}
            onChange={(event) =>
              setEditedTitle((_prevState) => event.target.value)
            }
          />
        </form>
      )}
    </div>
  );
}
