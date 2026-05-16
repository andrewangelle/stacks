import { useState } from 'react';
import * as Bs from 'react-icons/bs';

import { ChecklistCheckbox } from '~/components/ChecklistCheckbox';
import { DeleteChecklistPopover } from '~/components/DeleteChecklistPopover';
import { DragDropChecklistItem } from '~/components/DragDropChecklistItems';
import {
  type ChecklistItemType,
  useCreateChecklistItemMutation,
  useGetChecklistItemsQuery,
} from '~/query/checklistItems';
import { type ChecklistType, useGetChecklistsQuery } from '~/query/checklists';
import {
  AddChecklistButton,
  AddChecklistItemButton,
  AddChecklistItemInput,
  CardModalTitle,
  ChecklistHeader,
  ChecklistProgressIndicator,
  ChecklistProgressPercentage,
  ChecklistProgressRoot,
  CloseDescriptionButton,
} from '~/styles/CardModal';
import { Flex } from '~/styles/Page';

function Checklist(props: ChecklistType) {
  const { data } = useGetChecklistItemsQuery({ checklistId: props.id });
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const [createChecklistItem] = useCreateChecklistItemMutation();

  const completedItems = data?.filter((item) => item.isCompleted);
  const progressValue = (completedItems?.length || 0) / (data?.length || 0);
  const progressPercent = Math.round(
    (Number.isNaN(progressValue) ? 0 : progressValue) * 100,
  );

  return (
    <div style={{ margin: '30px 0px' }}>
      <ChecklistHeader data-testid="ChecklistHeader" key={props.id}>
        <Flex data-testid="Flex">
          <Bs.BsCheck2Square style={{ marginRight: '4px' }} />
          <CardModalTitle data-testid="CardModalTitle">
            {props.checklistTitle}
          </CardModalTitle>
        </Flex>
        <DeleteChecklistPopover {...props} />
      </ChecklistHeader>

      <Flex data-testid="Flex" style={{ position: 'relative' }}>
        <ChecklistProgressPercentage data-testid="ChecklistProgressPercentage">
          {`${progressPercent}%`}
        </ChecklistProgressPercentage>

        <ChecklistProgressRoot
          data-testid="ChecklistProgressRoot"
          style={{ margin: '15px 0' }}
        >
          <ChecklistProgressIndicator
            data-testid="ChecklistProgressIndicator"
            style={{ width: `${progressPercent}%` }}
          />
        </ChecklistProgressRoot>
      </Flex>

      {data?.map((item: ChecklistItemType) => (
        <DragDropChecklistItem
          key={item.id}
          id={item.id}
          label={item.label}
          checklistId={props.id}
        >
          <ChecklistCheckbox {...item} />
        </DragDropChecklistItem>
      ))}

      {!isEditing && (
        <AddChecklistItemButton
          data-testid="AddChecklistItemButton"
          secondary
          onClick={() => setIsEditing(true)}
        >
          Add an item
        </AddChecklistItemButton>
      )}

      {isEditing && (
        <>
          <AddChecklistItemInput
            data-testid="AddChecklistItemInput"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={'Add an item'}
          />
          <Flex data-testid="Flex">
            <AddChecklistButton
              data-testid="AddChecklistButton"
              onClick={() => {
                createChecklistItem({
                  label,
                  cardId: props.cardId,
                  checklistId: props.id,
                  listId: props.listId,
                });
                setIsEditing(false);
              }}
            >
              Add
            </AddChecklistButton>
            <CloseDescriptionButton
              data-testid="CloseDescriptionButton"
              secondary
              onClick={() => setIsEditing(false)}
            >
              X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </div>
  );
}

export function CardModalChecklists({ cardId }: { cardId: string }) {
  const { data } = useGetChecklistsQuery({ cardId });
  return (
    <div style={{ marginTop: '30px' }}>
      {data?.map((checklist) => (
        <Checklist key={checklist.id} {...checklist} />
      ))}
    </div>
  );
}
