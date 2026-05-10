import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { type CSSProperties, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import { useOutsideClick } from '~/components/ListCard';

const AiOutlineCheck = AiIcons.AiOutlineCheck;
const AiOutlineEllipsis = AiIcons.AiOutlineEllipsis;

import { useCreateActivityMutation } from '~/store/activityApi';
import type { ChecklistItemType } from '~/store/checklistItemsApi';
import {
  useDeleteChecklistItemMutation,
  useUpdateChecklistItemMutation,
} from '~/store/checklistItemsApi';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  AddChecklistButton,
  AddChecklistItemInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  ChecklistCheckboxContainer,
  ChecklistPopoverHeader,
  CloseDescriptionButton,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/styles/CardModal';
import { Flex } from '~/styles/Page';

export function ChecklistCheckbox(props: ChecklistItemType) {
  const params = useParams({ strict: false });
  const [updateItem] = useUpdateChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [editedLabel, setEditedLabel] = useState(props.label);
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

  return (
    <ChecklistCheckboxContainer
      isHovering={isHovering}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
    >
      <CheckboxRoot
        checked={props.isCompleted}
        style={{
          height: 16,
          width: 16,
          borderColor: 'rgb(223 225, padding: 25 230)',
          verticalAlign: 'top',
        }}
        onClick={() => {
          updateItem({
            id: props.id,
            cardId: props.cardId,
            label: editedLabel,
            checklistId: props.checklistId,
            isCompleted: !props.isCompleted,
          });
          createActivity({
            cardId: props.cardId,
            listId: props.listId,
            boardId: params.id ?? '',
            type: 'feed',
            content: `marked ${editedLabel} ${props.isCompleted ? 'incomplete' : 'complete'} on this card`,
          });
        }}
      >
        <CheckboxIndicator>
          <AiOutlineCheck style={checkIconStyles} />
        </CheckboxIndicator>
      </CheckboxRoot>

      {!isEditingLabel && (
        <CheckboxLabel
          checked={props.isCompleted}
          onClick={() => setIsEditingLabel(true)}
        >
          {props.label}
        </CheckboxLabel>
      )}

      {isEditingLabel && (
        <>
          <AddChecklistItemInput
            value={editedLabel}
            onChange={(event) => setEditedLabel(event.target.value)}
            placeholder={editedLabel}
          />
          <Flex style={{ marginLeft: '20px' }}>
            <AddChecklistButton
              onClick={() => {
                updateItem({
                  id: props.id,
                  cardId: props.cardId,
                  label: editedLabel,
                  checklistId: props.checklistId,
                  isCompleted: props.isCompleted,
                });
                setIsEditingLabel(false);
                setEditedLabel('');
              }}
            >
              Save
            </AddChecklistButton>
            <CloseDescriptionButton
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
          <DeleteChecklistPopoverTrigger>
            <AiOutlineEllipsis
              onClick={() => setDeleteOpen(true)}
              style={{ position: 'absolute', right: 5, top: 15 }}
            />
          </DeleteChecklistPopoverTrigger>

          <DeleteChecklistPopoverContent side="right">
            <ChecklistPopoverHeader>
              Item actions
              <PopoverClose onClick={() => setDeleteOpen(false)}>
                X
              </PopoverClose>
            </ChecklistPopoverHeader>

            <CreateBoardCloseBorder />

            <DeleteChecklistPopoverButton
              onClick={() =>
                deleteChecklistItem({
                  id: props.id,
                  checklistId: props.checklistId,
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
