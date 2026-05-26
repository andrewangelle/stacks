import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  CardModalTitle,
  CloseDescriptionButton,
} from '~/components/Cards/CardModal.styled';
import { ChecklistCheckbox } from '~/components/Checklists/ChecklistCheckbox';
import {
  AddChecklistButton,
  AddChecklistItemButton,
  AddChecklistItemInput,
  ChecklistHeader,
  ChecklistProgressIndicator,
  ChecklistProgressPercentage,
  ChecklistProgressRoot,
} from '~/components/Checklists/Checklists.styled';
import { DeleteChecklistPopover } from '~/components/Checklists/DeleteChecklistPopover';
import { DragDropChecklistItem } from '~/components/Checklists/DragDropChecklistItems';
import {
  type ChecklistItemType,
  useCreateChecklistItemMutation,
  useGetChecklistItemsQuery,
} from '~/query/checklistItems';
import {
  useGetChecklistQuery,
  useGetChecklistsQuery,
} from '~/query/checklists';
import { Flex } from '~/styles/Page.styled';

function Checklist(props: { id: string }) {
  const { data: checklist } = useGetChecklistQuery({ id: props.id });
  const { data } = useGetChecklistItemsQuery({ checklistId: props.id });
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const [createChecklistItem] = useCreateChecklistItemMutation();

  const completedItems = data?.filter((item) => item.isCompleted);
  const progressValue = (completedItems?.length || 0) / (data?.length || 0);
  const progressPercent = Math.round(
    (Number.isNaN(progressValue) ? 0 : progressValue) * 100,
  );

  if (!checklist) return null;

  return (
    <div style={{ margin: '30px 0px' }}>
      <ChecklistHeader data-testid="ChecklistHeader" key={props.id}>
        <Flex data-testid="Flex">
          <Bs.BsCheck2Square style={{ marginRight: '4px' }} />
          <CardModalTitle data-testid="CardModalTitle">
            {checklist?.checklistTitle}
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
          <ChecklistCheckbox id={item.id} />
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
                  cardId: checklist?.cardId,
                  checklistId: props.id,
                  listId: checklist?.listId,
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
    <div style={{ margin: '30px 12px 0px' }}>
      {data?.map((checklist) => (
        <Checklist key={checklist.id} id={checklist.id} />
      ))}
    </div>
  );
}
