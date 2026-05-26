import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { type CSSProperties, useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import { useOutsideClick } from '~/utils/useOutsideClick';

const AiOutlineCheck = AiIcons.AiOutlineCheck;
const AiOutlineEllipsis = AiIcons.AiOutlineEllipsis;

import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { CloseDescriptionButton } from '~/components/Cards/CardModal.styled';
import {
  AddChecklistButton,
  AddChecklistItemInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  ChecklistCheckboxContainer,
  ChecklistPopoverHeader,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/components/Checklists/Checklists.styled';
import { useCreateActivityMutation } from '~/query/activity';
import {
  useDeleteChecklistItemMutation,
  useGetChecklistItemQuery,
  useUpdateChecklistItemMutation,
} from '~/query/checklistItems';
import { Flex } from '~/styles/Page.styled';

export function ChecklistCheckbox(props: { id: string }) {
  const params = useParams({ strict: false });
  const { data: checklistItem } = useGetChecklistItemQuery({ id: props.id });
  const [updateItem] = useUpdateChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [editedLabel, setEditedLabel] = useState(checklistItem?.label);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [createActivity] = useCreateActivityMutation();

  const outsideClickRef = useOutsideClick(
    () => setDeleteOpen(false),
    isDeleteOpen,
  );

  const checkIconStyles: CSSProperties = {
    position: 'absolute',
    top: '-1px',
    left: '0px',
  };

  function toggleCheckbox() {
    if (checklistItem) {
      updateItem({
        id: props.id,
        cardId: checklistItem.cardId,
        label: editedLabel ?? checklistItem.label,
        checklistId: checklistItem.checklistId,
        isCompleted: !checklistItem.isCompleted,
      });
      createActivity({
        cardId: checklistItem.cardId,
        listId: checklistItem.listId,
        boardId: params.id ?? '',
        type: 'feed',
        content: `marked ${editedLabel} ${checklistItem.isCompleted ? 'incomplete' : 'complete'} on this card`,
      });
    }
  }

  function addChecklistItem() {
    if (checklistItem) {
      updateItem({
        id: props.id,
        cardId: checklistItem.cardId,
        label: editedLabel ?? checklistItem.label,
        checklistId: checklistItem.checklistId,
        isCompleted: checklistItem.isCompleted,
      });
      setIsEditingLabel(false);
    }
  }

  useEffect(() => {
    if (checklistItem?.label && !editedLabel) {
      setEditedLabel(checklistItem.label);
    }
  }, [editedLabel, checklistItem?.label]);

  if (!checklistItem) return null;

  return (
    <ChecklistCheckboxContainer
      data-testid="ChecklistCheckboxContainer"
      isHovering={isHovering}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
    >
      <CheckboxRoot
        data-testid="CheckboxRoot"
        checked={checklistItem.isCompleted}
        style={{
          height: 16,
          width: 16,
          borderColor: 'rgb(223 225, padding: 25 230)',
          verticalAlign: 'top',
        }}
        onClick={toggleCheckbox}
      >
        <CheckboxIndicator data-testid="CheckboxIndicator">
          <AiOutlineCheck style={checkIconStyles} />
        </CheckboxIndicator>
      </CheckboxRoot>

      {!isEditingLabel && (
        <CheckboxLabel
          data-testid="CheckboxLabel"
          checked={checklistItem.isCompleted}
          onClick={() => setIsEditingLabel(true)}
        >
          {checklistItem.label}
        </CheckboxLabel>
      )}

      {isEditingLabel && (
        <>
          <AddChecklistItemInput
            data-testid="AddChecklistItemInput"
            value={editedLabel}
            onChange={(event) => setEditedLabel(event.target.value)}
            placeholder={editedLabel}
          />
          <Flex data-testid="Flex" style={{ marginLeft: '20px' }}>
            <AddChecklistButton
              data-testid="AddChecklistButton"
              onClick={addChecklistItem}
            >
              Save
            </AddChecklistButton>
            <CloseDescriptionButton
              data-testid="CloseDescriptionButton"
              secondary
              onClick={() => setIsEditingLabel(false)}
            >
              X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}

      <span ref={outsideClickRef}>
        <Popover.Root open={isDeleteOpen}>
          <DeleteChecklistPopoverTrigger data-testid="DeleteChecklistPopoverTrigger">
            <AiOutlineEllipsis
              onClick={() => setDeleteOpen(true)}
              style={{ position: 'absolute', right: 5, top: 15 }}
            />
          </DeleteChecklistPopoverTrigger>

          <DeleteChecklistPopoverContent
            data-testid="DeleteChecklistPopoverContent"
            side="right"
          >
            <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
              Item actions
              <PopoverClose
                data-testid="PopoverClose"
                onClick={() => setDeleteOpen(false)}
              >
                X
              </PopoverClose>
            </ChecklistPopoverHeader>

            <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

            <DeleteChecklistPopoverButton
              data-testid="DeleteChecklistPopoverButton"
              onClick={() =>
                deleteChecklistItem({
                  id: props.id,
                  checklistId: checklistItem.checklistId,
                })
              }
            >
              Delete
            </DeleteChecklistPopoverButton>
          </DeleteChecklistPopoverContent>
        </Popover.Root>
      </span>
    </ChecklistCheckboxContainer>
  );
}
