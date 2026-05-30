import * as Popover from '@radix-ui/react-popover';
import { type CSSProperties, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
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
import { useCreateActivity } from '~/query/activity';
import {
  useDeleteChecklistItem,
  useGetChecklistItem,
  useUpdateChecklistItem,
} from '~/query/checklistItems';
import { Flex } from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

const AiOutlineCheck = AiIcons.AiOutlineCheck;
const AiOutlineEllipsis = AiIcons.AiOutlineEllipsis;

export function Checkbox({ id }: { id: string }) {
  const boardId = useCurrentBoardId();
  const { data: checklistItem } = useGetChecklistItem({ itemId: id });
  const updateItem = useUpdateChecklistItem();
  const deleteChecklistItem = useDeleteChecklistItem();
  const [editedLabel, setEditedLabel] = useState(checklistItem?.label);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const createActivity = useCreateActivity();

  const clickOutsideDeletePopoverRef = useOutsideClick(
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
        itemId: id,
        label: editedLabel ?? checklistItem.label,
        isCompleted: !checklistItem.isCompleted,
      });

      const contentNextState = checklistItem.isCompleted
        ? 'incomplete'
        : 'complete';

      createActivity({
        cardId: checklistItem.cardId,
        listId: checklistItem.listId,
        boardId,
        type: 'feed',
        content: `marked ${editedLabel} ${contentNextState} on this card`,
      });
    }
  }

  function addChecklistItem() {
    if (checklistItem) {
      updateItem({
        itemId: id,
        label: editedLabel ?? checklistItem.label,
        isCompleted: checklistItem.isCompleted,
      });
      setIsEditingLabel(false);
    }
  }

  if (!checklistItem) return null;

  return (
    <ChecklistCheckboxContainer
      data-testid="ChecklistCheckboxContainer"
      isHovering={isHovering && !isEditingLabel}
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
          onClick={() => {
            setIsEditingLabel(true);
            setEditedLabel(checklistItem.label);
          }}
        >
          {checklistItem.label}
        </CheckboxLabel>
      )}

      {isEditingLabel && (
        <>
          <AddChecklistItemInput
            data-testid="AddChecklistItemInput"
            value={editedLabel}
            placeholder={editedLabel}
            autoFocus
            onChange={(event) => setEditedLabel(event.target.value)}
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

      <span ref={clickOutsideDeletePopoverRef}>
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
                  itemId: id,
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
