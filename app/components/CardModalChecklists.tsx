import { BsCheck2Square } from "react-icons/bs";
import {  useState } from "react";
import { useRecoilState } from "recoil";

import { 
  CloseDescriptionButton, 
  DeleteChecklistPopover, 
  ModalTitle, 
  ChecklistCheckbox 
} from '~/components';
import {
  ChecklistHeader, 
  ChecklistProgressIndicator, 
  ChecklistProgressPercentage, 
  ChecklistProgressRoot, 
  Flex,
  AddChecklistItemInput,
  AddChecklistItemButton,
  AddChecklistButton,
} from "~/styles";

import { 
  ChecklistItemType,
  ChecklistType,
  tokenState,
  useCreateChecklistItemMutation,
  useGetChecklistItemsQuery,
  useGetChecklistsQuery,
} from "~/store";
import { DragDropChecklistItem } from "./DragDropChecklistItems";


function Checklist(
  props: ChecklistType
){
  const { data } = useGetChecklistItemsQuery({checklistId: props.id});
  const [token] = useRecoilState(tokenState);
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const [createChecklistItem] = useCreateChecklistItemMutation();
  
  const completedItems = data?.filter(item => item.isCompleted);
  const progressValue = (completedItems?.length || 0) / (data?.length || 0)
  const progressPercent = Math.round((isNaN(progressValue) ? 0 : progressValue) * 100);

  return (
    <div style={{margin: '30px 0px'}}>
      <ChecklistHeader key={props.id}>
        <Flex>
          <BsCheck2Square style={{marginRight: '4px'}} />
          <ModalTitle>{props.checklistTitle}</ModalTitle>
        </Flex>
        <DeleteChecklistPopover {...props} />
      </ChecklistHeader>

      <Flex style={{position: 'relative'}}>
        <ChecklistProgressPercentage>
          {`${progressPercent}%`}
        </ChecklistProgressPercentage>

        <ChecklistProgressRoot style={{margin: '15px 0'}}>
          <ChecklistProgressIndicator style={{ width: `${progressPercent}%` }}  />
        </ChecklistProgressRoot>
      </Flex>

      {data?.map((item: ChecklistItemType) => (
        <DragDropChecklistItem 
          key={item.id} 
          id={item.id} 
          label={item.label} 
          checklistId={props.id}
        >
          <ChecklistCheckbox  {...item} />
        </DragDropChecklistItem>
      ))}

      {!isEditing && (
        <AddChecklistItemButton secondary onClick={() => setIsEditing(true)}>
          Add an item
        </AddChecklistItemButton>
      )}

      {isEditing && (
        <>  
          <AddChecklistItemInput 
            value={label} 
            onChange={event => setLabel(event.target.value)}
            placeholder={'Add an item'}
          />
          <Flex>
            <AddChecklistButton
              onClick={() => {
                createChecklistItem({
                  label,
                  cardId: props.cardId,
                  checklistId: props.id,
                  token: token?.access_token!,
                  userId: token?.user.id!

                })
                setIsEditing(false);
              }}
            >
              Add 
            </AddChecklistButton>
            <CloseDescriptionButton 
              secondary 
              onClick={() => setIsEditing(false)}
            >
              X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </div>
  )
}

export function CardModalChecklists({ cardId }: { cardId: string }){
  const { data } = useGetChecklistsQuery({ cardId });
  return (
    <div style={{marginTop: '30px'}}>
      {data?.map(checklist => (
        <Checklist key={checklist.id} {...checklist} />
      ))}
    </div>
  ) 
}
