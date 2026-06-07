import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { useGetChecklists } from '~/query/checklists';
import { useAutoScrollToChecklist } from '~/utils/useAutoScrollToChecklist';

type CardChecklistsProps = {
  cardId: string;
  scrollToChecklistId?: string;
};

export function CardChecklists({
  cardId,
  scrollToChecklistId,
}: CardChecklistsProps) {
  const { data } = useGetChecklists({ cardId });
  const { ref } = useAutoScrollToChecklist({
    cardId,
    scrollToChecklistId,
  });

  return (
    <ChecklistsContainer data-testid="ChecklistsContainer" ref={ref}>
      {data?.map((checklist) => (
        <div data-checklist-id={checklist.id} key={checklist.id}>
          <Checklist id={checklist.id} />
        </div>
      ))}
    </ChecklistsContainer>
  );
}
