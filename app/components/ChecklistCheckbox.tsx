import { useState, CSSProperties } from "react";
import { AiOutlineCheck, AiOutlineEllipsis } from "react-icons/ai";
import { useRecoilState } from "recoil";
import * as Popover from '@radix-ui/react-popover';

import { 
  ChecklistCheckboxContainer, 
  CheckboxRoot, 
  CheckboxIndicator, 
  CheckboxLabel, 
  AddChecklistItemInput, 
  Flex, 
  AddChecklistButton,
  ChecklistPopoverHeader,
  CreateBoardCloseBorder,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
  PopoverClose
} from "~/styles";
import { CloseDescriptionButton, useOutsideClick } from "~/components";

import { 
  ChecklistItemType, 
  tokenState, 
  useDeleteChecklistItemMutation, 
  useUpdateChecklistItemMutation 
} from "~/store";

export function ChecklistCheckbox(props: ChecklistItemType){
  const [token] = useRecoilState(tokenState);
  const [updateItem] = useUpdateChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [editedLabel, setEditedLabel] = useState(props.label);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const outsideClickRef = useOutsideClick(() => setDeleteOpen(false), isDeleteOpen);

  const checkIconStyles: CSSProperties = { 
    position: 'absolute', 
    top: '-1px', 
    left: '0px'
  }

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
          verticalAlign: 'top'
        }}
        onClick={() => updateItem({
          id: props.id,
          token: token?.access_token!,
          userId: token?.user.id!,
          cardId: props.cardId,
          label: editedLabel,
          checklistId: props.checklistId,
          isCompleted: !props.isCompleted
        })}
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
            onChange={event => setEditedLabel(event.target.value)}
            placeholder={editedLabel}
          />
          <Flex style={{marginLeft: '20px'}}>
            <AddChecklistButton
              onClick={() => {
                updateItem({
                  id: props.id,
                  token: token?.access_token!,
                  userId: token?.user.id!,
                  cardId: props.cardId,
                  label: editedLabel,
                  checklistId: props.checklistId,
                  isCompleted: props.isCompleted
                });
                setIsEditingLabel(false);
                setEditedLabel('')
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
        <Popover.Root open={isDeleteOpen} >
          <DeleteChecklistPopoverTrigger>
            <AiOutlineEllipsis
              onClick={() => setDeleteOpen(true)}
              style={{position: 'absolute', right: 5, top: 15}}
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
                  token: token?.access_token!,
                  id: props.id,
                  checklistId: props.checklistId
                })
              }
            >
              Delete
            </DeleteChecklistPopoverButton>
          </DeleteChecklistPopoverContent>
        </Popover.Root>
      </span>


    </ChecklistCheckboxContainer> 
  )
}