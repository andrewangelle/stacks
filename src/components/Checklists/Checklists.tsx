import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { Draggable } from '~/components/Draggable';
import { reorderChecklists, useGetChecklists } from '~/query/checklists';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardChecklists() {
  const cardId = useCurrentCardId();
  const { data } = useGetChecklists({ cardId });

  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
      {data?.map((checklist) => (
        <Draggable
          key={checklist.id}
          id={checklist.id}
          name={checklist.checklistTitle}
          type="checklist"
          onDrop={(item: { id: string }) =>
            reorderChecklists(item, cardId, checklist.id)
          }
        >
          <Checklist id={checklist.id} />
        </Draggable>
      ))}
    </ChecklistsContainer>
  );
}
