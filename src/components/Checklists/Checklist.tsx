import type { ChecklistItem as ChecklistItemType } from '@prisma/client';
import * as Bs from 'react-icons/bs';
import { CardModalTitle } from '~/components/Cards/CardModal.styled';
import { AddChecklistItem } from '~/components/ChecklistItem/AddChecklistItem';
import { ChecklistItem } from '~/components/ChecklistItem/ChecklistItem';
import { ChecklistProgress } from '~/components/Checklists/ChecklistProgress';
import { ChecklistHeader } from '~/components/Checklists/Checklists.styled';
import { DeleteChecklist } from '~/components/Checklists/DeleteChecklist';
import { Draggable } from '~/components/Draggable';
import {
  reorderChecklistItems,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { Flex } from '~/styles/Page.styled';

export function Checklist({ id }: { id: string }) {
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const { data } = useGetChecklistItems({ checklistId: id });

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

      <ChecklistProgress checklistId={id} />

      {data?.map((checklistItem: ChecklistItemType) => (
        <Draggable
          key={checklistItem.id}
          id={checklistItem.id}
          name={checklistItem.label}
          type="checklistItem"
          onDrop={(item: ChecklistItemType) =>
            reorderChecklistItems(item, id, checklistItem.id)
          }
        >
          <ChecklistItem id={checklistItem.id} />
        </Draggable>
      ))}

      <AddChecklistItem checklistId={id} />
    </div>
  );
}
