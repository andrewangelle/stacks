import type { ChecklistItem } from '@prisma/client';
import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  CardModalTitle,
  CloseDescriptionButton,
} from '~/components/Cards/CardModal.styled';
import { Checkbox } from '~/components/Checklists/Checkbox';
import {
  AddChecklistButton,
  AddChecklistItemButton,
  AddChecklistItemInputIndented,
  ChecklistContentColumn,
  ChecklistHeader,
  ChecklistItemActionsIndented,
  ChecklistLeadingColumn,
  ChecklistProgressIndicator,
  ChecklistProgressPercentage,
  ChecklistProgressRoot,
  ChecklistProgressRow,
} from '~/components/Checklists/Checklists.styled';
import { DeleteChecklist } from '~/components/Checklists/DeleteChecklist';
import { DragDropChecklistItem } from '~/components/Checklists/DragDropChecklistItems';
import {
  useCreateChecklistItem,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { Flex } from '~/styles/Page.styled';

export function Checklist({ id }: { id: string }) {
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const { data } = useGetChecklistItems({ checklistId: id });
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const createChecklistItem = useCreateChecklistItem();

  const completedItems = data?.filter((item) => item.isCompleted);
  const progressPercent = getPercent(data?.length, completedItems?.length);

  if (!checklist) return null;

  return (
    <div style={{ margin: '30px 0px' }}>
      <ChecklistHeader data-testid="ChecklistHeader" key={id}>
        <Flex data-testid="Flex">
          <Bs.BsCheck2Square size={24} />
          <CardModalTitle data-testid="CardModalTitle">
            {checklist?.checklistTitle}
          </CardModalTitle>
        </Flex>
        <DeleteChecklist id={id} />
      </ChecklistHeader>

      <ChecklistProgressRow data-testid="ChecklistProgressRow">
        <ChecklistLeadingColumn data-testid="ChecklistLeadingColumn">
          <ChecklistProgressPercentage data-testid="ChecklistProgressPercentage">
            {`${progressPercent}%`}
          </ChecklistProgressPercentage>
        </ChecklistLeadingColumn>

        <ChecklistContentColumn data-testid="ChecklistContentColumn">
          <ChecklistProgressRoot data-testid="ChecklistProgressRoot">
            <ChecklistProgressIndicator
              data-testid="ChecklistProgressIndicator"
              style={{ width: `${progressPercent}%` }}
            />
          </ChecklistProgressRoot>
        </ChecklistContentColumn>
      </ChecklistProgressRow>

      {data?.map((item: ChecklistItem) => (
        <DragDropChecklistItem
          key={item.id}
          id={item.id}
          label={item.label}
          checklistId={id}
        >
          <Checkbox id={item.id} />
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
          <AddChecklistItemInputIndented
            data-testid="AddChecklistItemInput"
            value={label}
            placeholder={'Add an item'}
            autoFocus
            onChange={(event) => setLabel(event.target.value)}
          />
          <ChecklistItemActionsIndented data-testid="ChecklistItemActions">
            <AddChecklistButton
              data-testid="AddChecklistButton"
              onClick={() => {
                createChecklistItem({
                  label,
                  cardId: checklist?.cardId,
                  checklistId: id,
                  listId: checklist?.listId,
                });
                setIsEditing(false);
                setLabel('');
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
          </ChecklistItemActionsIndented>
        </>
      )}
    </div>
  );
}

function getPercent(total?: number, completed?: number) {
  const value = (completed || 0) / (total || 0);
  return Math.round((Number.isNaN(value) ? 0 : value) * 100);
}
