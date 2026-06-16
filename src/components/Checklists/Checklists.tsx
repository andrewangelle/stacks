import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { Draggable } from '~/components/dnd/Draggable';
import { reorderChecklistsByIndex, useGetChecklists } from '~/query/checklists';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardChecklists() {
  const cardId = useCurrentCardId();
  const { data } = useGetChecklists({ cardId });

  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
      {data?.map((checklist, index) => (
        <Draggable
          key={checklist.id}
          id={checklist.id}
          name={checklist.checklistTitle}
          type="checklist"
          index={index}
          group={cardId}
          onReorder={(fromIndex, toIndex) =>
            reorderChecklistsByIndex(cardId, fromIndex, toIndex)
          }
        >
          <Checklist id={checklist.id} />
        </Draggable>
      ))}
    </ChecklistsContainer>
  );
}
