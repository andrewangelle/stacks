import { Checklist } from '~/components/Checklists/Checklist';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { useGetChecklistsQuery } from '~/query/checklists';

export function CardModalChecklists({ cardId }: { cardId: string }) {
  const { data } = useGetChecklistsQuery({ cardId });
  return (
    <ChecklistsContainer data-testid="ChecklistsContainer">
      {data?.map((checklist) => (
        <Checklist key={checklist.id} id={checklist.id} />
      ))}
    </ChecklistsContainer>
  );
}
